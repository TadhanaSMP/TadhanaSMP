import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
const reservation = createServer();
await new Promise((resolve) => reservation.listen(0, "127.0.0.1", resolve));
const port = reservation.address().port;
await new Promise((resolve) => reservation.close(resolve));
const origin = `http://127.0.0.1:${port}`;
let logs = "";
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  {
    env: {
      ...process.env,
      AUTH_ENABLED: "false",
      ANNOUNCEMENTS_ENABLED: "false",
      SITE_URL: "https://smoke.example.test",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
child.stdout.on("data", (d) => {
  logs += d;
});
child.stderr.on("data", (d) => {
  logs += d;
});
let checks = 0;
async function get(path, options) {
  return fetch(origin + path, {
    ...options,
    signal: AbortSignal.timeout(15000),
    redirect: "manual",
  });
}
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try {
      if ((await get("/api/config")).ok) {
        ready = true;
        break;
      }
    } catch {
      /* Startup is not yet ready. */
    }
    await delay(100);
  }
  assert.ok(ready, "Production server did not start");
  const routes = [
    "/",
    "/our-story",
    "/world",
    "/features",
    "/play",
    "/memories",
    "/ranks",
    "/news",
    "/rules",
    "/rules/server",
    "/rules/staff",
    "/faq",
    "/status",
    "/support",
    "/store",
    "/privacy",
    "/terms",
    "/cookies",
  ];
  for (const path of routes) {
    const r = await get(path);
    assert.equal(r.status, 200, path);
    const html = await r.text();
    assert.equal(
      (html.match(/<h1(?:\s|>)/g) || []).length,
      1,
      `${path}: one H1`,
    );
    assert.ok(html.includes("TadhanaSMP"), path);
    assert.ok(html.includes('rel="canonical"'), `${path}: canonical`);
    assert.ok(
      r.headers.get("content-security-policy")?.includes("object-src 'none'"),
    );
    assert.equal(r.headers.get("x-content-type-options"), "nosniff");
    assert.equal(r.headers.get("x-frame-options"), "DENY");
    checks += 7;
  }
  for (const [from, to] of [
    ["/about", "/our-story"],
    ["/join", "/play"],
    ["/gallery", "/memories"],
  ]) {
    const r = await get(from);
    assert.equal(r.status, 308);
    assert.equal(r.headers.get("location"), to);
    checks += 2;
  }
  for (const path of [
    "/not-a-real-route",
    "/news/not-a-real-announcement",
    "/qa.html",
    "/qa-components",
  ]) {
    assert.equal((await get(path)).status, 404);
    checks++;
  }
  const config = await (await get("/api/config")).json();
  assert.ok("invite" in config);
  for (const key of [
    "SESSION_SECRET",
    "DATABASE_URL",
    "DISCORD_BOT_TOKEN",
    "VERIFICATION_API_SECRET",
  ])
    assert.equal(config[key], undefined);
  checks += 5;
  const me = await get("/api/auth/me");
  assert.match(me.headers.get("cache-control"), /no-store/);
  assert.deepEqual(await me.json(), { user: null, enabled: false });
  checks += 2;
  for (const path of [
    "/api/auth/discord/login",
    "/api/auth/discord/callback",
  ]) {
    assert.equal((await get(path)).status, 503);
    checks++;
  }
  for (const path of [
    "/api/auth/logout",
    "/api/auth/otp/generate",
    "/api/auth/verify",
  ]) {
    assert.equal(
      (
        await get(path, {
          method: "POST",
          headers: { Origin: "https://untrusted.example.test" },
        })
      ).status,
      403,
    );
    checks++;
  }
  for (const path of ["/api/auth/otp/generate", "/api/auth/verify"]) {
    const r = await get(path, {
      method: "POST",
      headers: { Origin: "https://smoke.example.test" },
    });
    assert.equal(r.status, 503, `${path}: disabled integration`);
    assert.match(r.headers.get("cache-control"), /no-store/);
    checks += 2;
  }
  const logout = await get("/api/auth/logout", {
    method: "POST",
    headers: { Origin: "https://smoke.example.test" },
  });
  assert.equal(logout.status, 200);
  assert.deepEqual(await logout.json(), { ok: true });
  assert.match(logout.headers.get("set-cookie"), /HttpOnly/);
  assert.match(logout.headers.get("set-cookie"), /Secure/);
  checks += 4;
  assert.equal(
    (
      await get("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp: "TADHANA-A12BC",
          discordUserId: "123456789012345678",
        }),
      })
    ).status,
    503,
  );
  checks++;
  const feed = await get("/api/announcements");
  assert.equal(feed.status, 200);
  assert.equal((await feed.json()).state, "pending");
  assert.equal((await get("/api/announcements?page=99")).status, 400);
  assert.equal((await get("/api/announcements/ingest",{method:"POST"})).status,503);
  checks += 4;
  const dual = await (await get("/api/server-status")).json();
  assert.equal(dual.java.host,"play.TadhanaSMP.com");
  assert.equal(dual.java.port,null);
  assert.equal(dual.bedrock.host,"play.TadhanaSMP.com");
  assert.equal(dual.bedrock.port,25706);
  assert.ok(!("totalPlayers" in dual));
  checks += 5;
  const status = await (await get("/api/status")).json();
  assert.ok(
    ["unknown", "maintenance", "online", "offline"].includes(status.state),
  );
  if (status.state === "unknown" || status.state === "maintenance")
    assert.equal(status.players, null);
  checks += 2;
  for (const path of [
    "/sitemap.xml",
    "/robots.txt",
    "/favicon.png",
    "/apple-touch-icon.png",
    "/images/social-preview.jpg",
    "/images/brand/wordmark.webp",
    "/images/memories/town-sign-1920.webp",
  ]) {
    assert.equal((await get(path)).status, 200, path);
    checks++;
  }
  for (const path of ["/privacy", "/terms", "/rules", "/store", "/support"]) {
    assert.match(await (await get(path)).text(), /noindex/);
    checks++;
  }
  assert.doesNotMatch(
    logs,
    /Unhandled|PrismaClientInitializationError|TypeError|ReferenceError/,
  );
  checks++;
  console.log(
    `PASS: ${routes.length} public pages, legacy redirects, 404s, private API gates, headers, metadata and images (${checks} assertions).`,
  );
} catch (error) {
  console.error(error.message);
  console.error(logs);
  process.exitCode = 1;
} finally {
  child.kill("SIGTERM");
  await new Promise((resolve) => {
    if (child.exitCode !== null) resolve();
    else child.once("exit", resolve);
  });
}
