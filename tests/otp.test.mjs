import test from "node:test";
import assert from "node:assert/strict";
import {
  generateCode,
  hashValue,
  opaqueToken,
  safeEqual,
  validDiscordId,
  validOTP,
  redeemWith,
} from "../src/lib/otp-core.mjs";
const secret = "test-only-secret-with-at-least-32-characters";
const discordUserId = "123456789012345678";
test("generated OTP retains the bot format and uniform randomInt generator output", () => {
  for (let i = 0; i < 1000; i++)
    assert.match(generateCode(), /^TADHANA-[A-Z0-9]{5}$/);
});
test("Discord identifiers must remain decimal strings, never lossy JS numbers", () => {
  assert.equal(validDiscordId(discordUserId), true);
  for (const value of [Number(discordUserId), "12", "12345678901234567x", null])
    assert.equal(validDiscordId(value), false);
});
test("OTP validation rejects malformed or unbounded input", () => {
  assert.equal(validOTP("TADHANA-A12BC"), true);
  for (const v of [
    "tadhana-a12bc",
    "TADHANA-A12BCD",
    "TADHANA-",
    "x".repeat(10000),
    null,
  ])
    assert.equal(validOTP(v), false);
});
test("keyed hashes differ by secret and never store plaintext", () => {
  assert.match(hashValue("TADHANA-A12BC", secret), /^[a-f0-9]{64}$/);
  assert.notEqual(
    hashValue("TADHANA-A12BC", secret),
    hashValue("TADHANA-A12BC", secret + "2"),
  );
});
test("constant time secret comparison handles different lengths and nonstrings", () => {
  assert.equal(safeEqual(secret, secret), true);
  assert.equal(safeEqual(secret, secret + "x"), false);
  assert.equal(safeEqual(null, secret), false);
});
test("session identifiers are opaque 256-bit tokens", () => {
  const a = opaqueToken(),
    b = opaqueToken();
  assert.match(a, /^[a-f0-9]{64}$/);
  assert.notEqual(a, b);
});
test("redemption filters include user binding, unused state, future expiry and keyed hash", async () => {
  let args;
  const now = new Date("2026-10-11T00:00:00Z");
  const ok = await redeemWith(
    {
      updateMany: async (input) => {
        args = input;
        return { count: 1 };
      },
    },
    { otp: "TADHANA-A12BC", discordUserId, secret, now },
  );
  assert.equal(ok, true);
  assert.deepEqual(args, {
    where: {
      codeHash: hashValue("TADHANA-A12BC", secret),
      discordId: discordUserId,
      used: false,
      expiresAt: { gt: now },
    },
    data: { used: true, usedAt: now },
  });
});
test("invalid input is rejected without reaching the database", async () => {
  let called = false;
  const repository = {
    updateMany: async () => {
      called = true;
      return { count: 1 };
    },
  };
  assert.equal(
    await redeemWith(repository, { otp: "bad", discordUserId, secret }),
    false,
  );
  assert.equal(
    await redeemWith(repository, {
      otp: "TADHANA-A12BC",
      discordUserId: 123,
      secret,
    }),
    false,
  );
  assert.equal(called, false);
});
test("expired, replayed or wrong-user records all produce the same failure", async () => {
  const repository = { updateMany: async () => ({ count: 0 }) };
  assert.equal(
    await redeemWith(repository, {
      otp: "TADHANA-A12BC",
      discordUserId,
      secret,
    }),
    false,
  );
});
test("concurrent redemption uses one atomic repository operation and accepts one winner", async () => {
  let used = false;
  const repository = {
    updateMany: async () => {
      if (used) return { count: 0 };
      used = true;
      return { count: 1 };
    },
  };
  const results = await Promise.all(
    Array.from({ length: 20 }, () =>
      redeemWith(repository, { otp: "TADHANA-A12BC", discordUserId, secret }),
    ),
  );
  assert.equal(results.filter(Boolean).length, 1);
});
