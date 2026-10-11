import test from "node:test";
import assert from "node:assert/strict";
import {
  authenticationReady,
  configuredOrigin,
  matchesOrigin,
} from "../src/lib/auth-settings.mjs";
const settings = {
  AUTH_ENABLED: "true",
  SITE_URL: "https://staging.example.test",
  DATABASE_URL: "postgresql://test:test@db.example.test:5432/test",
  DISCORD_CLIENT_ID: "123456789012345678",
  DISCORD_CLIENT_SECRET: "test-oauth-private-value",
  DISCORD_REDIRECT_URI:
    "https://staging.example.test/api/auth/discord/callback",
  DISCORD_BOT_TOKEN: "test-only-bot-value",
  DISCORD_GUILD_ID: "123456789012345679",
  DISCORD_VERIFIED_ROLE_ID: "123456789012345680",
  SESSION_SECRET: "test-only-session-secret-with-32-characters",
  VERIFICATION_API_SECRET: "test-only-verification-secret-with-32-characters",
};
test("authentication fails closed when disabled, incomplete, or holding placeholders", () => {
  assert.equal(authenticationReady(settings), true);
  assert.equal(authenticationReady({}), false);
  assert.equal(
    authenticationReady({ ...settings, AUTH_ENABLED: "false" }),
    false,
  );
  for (const key of [
    "DATABASE_URL",
    "DISCORD_CLIENT_ID",
    "DISCORD_CLIENT_SECRET",
    "DISCORD_REDIRECT_URI",
    "DISCORD_BOT_TOKEN",
    "DISCORD_GUILD_ID",
    "DISCORD_VERIFIED_ROLE_ID",
    "SESSION_SECRET",
    "VERIFICATION_API_SECRET",
  ])
    assert.equal(authenticationReady({ ...settings, [key]: "" }), false, key);
  assert.equal(
    authenticationReady({
      ...settings,
      DATABASE_URL: "postgresql://USER:PASSWORD@HOST:5432/DATABASE",
    }),
    false,
  );
});
test("authentication rejects weak secrets, wrong database type, and lossy identifiers", () => {
  for (const changes of [
    { SESSION_SECRET: "short" },
    { VERIFICATION_API_SECRET: " ".repeat(40) },
    { DATABASE_URL: "file:local.db" },
    { DISCORD_GUILD_ID: "123" },
    { DISCORD_CLIENT_ID: String(Number(settings.DISCORD_CLIENT_ID)) + "x" },
  ])
    assert.equal(authenticationReady({ ...settings, ...changes }), false);
});
test("callback must use the configured origin and exact legacy path without credentials/query/fragment", () => {
  for (const uri of [
    "https://evil.example.test/api/auth/discord/callback",
    "https://staging.example.test/api/auth/callback",
    "https://staging.example.test/api/auth/discord/callback?returnTo=evil",
    "https://staging.example.test/api/auth/discord/callback#token",
    "https://user:password@staging.example.test/api/auth/discord/callback",
  ])
    assert.equal(
      authenticationReady({ ...settings, DISCORD_REDIRECT_URI: uri }),
      false,
      uri,
    );
});
test("production origin requires HTTPS and an origin-only URL; localhost HTTP is development-only", () => {
  for (const SITE_URL of [
    "http://example.test",
    "http://localhost:3000",
    "https://example.test/path",
    "https://example.test?x=1",
    "https://u:p@example.test",
  ])
    assert.throws(() => configuredOrigin({ SITE_URL }, true));
  assert.equal(
    configuredOrigin({ SITE_URL: "http://localhost:3000" }, false),
    "http://localhost:3000",
  );
});
test("browser Origin must match exactly and never relies on request Host", () => {
  assert.equal(matchesOrigin("https://staging.example.test", settings), true);
  for (const header of [
    null,
    "null",
    "https://staging.example.test.evil.test",
    "https://staging.example.test/",
    "http://staging.example.test",
  ])
    assert.equal(matchesOrigin(header, settings), false);
});
