import test from "node:test";
import assert from "node:assert/strict";
import {
  safeAddress,
  safePort,
  httpsUrl,
  approvedStatusUrl,
  normalizeStatus,
  contrast,
} from "../src/lib/validation.mjs";
test("connection hosts reject protocol, port, whitespace and injection fragments", () => {
  assert.equal(safeAddress("play.example.test"), "play.example.test");
  assert.equal(safeAddress("[2001:db8::1]"), "[2001:db8::1]");
  for (const v of [
    "https://host",
    "host:19132",
    "a..b",
    "host/path",
    "host<script>",
    "host name",
  ])
    assert.equal(safeAddress(v), "");
});
test("edition ports are separate valid integers", () => {
  assert.equal(safePort("25570"), 25570);
  assert.equal(safePort("19133"), 19133);
  for (const v of ["", "0", "65536", "1.5", "abc", "-1"])
    assert.equal(safePort(v), null);
});
test("external URLs require HTTPS and disallow URL credentials", () => {
  assert.equal(
    httpsUrl("https://example.test/store"),
    "https://example.test/store",
  );
  for (const v of [
    "javascript:alert(1)",
    "http://example.test",
    "https://user:pass@example.test",
    "bad",
  ])
    assert.equal(httpsUrl(v), "");
});
test("status endpoint guard rejects common private hosts and insecure services", () => {
  for (const v of [
    "http://api.example.test",
    "https://localhost",
    "https://127.0.0.1",
    "https://10.0.0.2",
    "https://192.168.1.1",
    "https://172.16.0.1",
    "https://169.254.169.254",
    "https://[::1]",
  ])
    assert.equal(approvedStatusUrl(v), "");
  assert.equal(
    approvedStatusUrl("https://status.example.test/minecraft"),
    "https://status.example.test/minecraft",
  );
});
test("status data does not turn invalid or missing data into online or zero players", () => {
  assert.equal(normalizeStatus({ online: "true" }).state, "unknown");
  assert.deepEqual(
    normalizeStatus({ online: false, players: 5, maximum: 10 }),
    { state: "offline", players: null, maximum: null },
  );
  assert.deepEqual(
    normalizeStatus({ online: true, players: -1, maximum: "20" }),
    { state: "online", players: null, maximum: null },
  );
  assert.deepEqual(normalizeStatus({ online: true, players: 0, maximum: 20 }), {
    state: "online",
    players: 0,
    maximum: 20,
  });
});
test("the actual text and CTA token pairs meet AA normal-text contrast targets", () => {
  for (const [a, b] of [
    ["#FFE4F2", "#080919"],
    ["#B8B4CD", "#080919"],
    ["#FFE4F2", "#111225"],
    ["#B8B4CD", "#17172F"],
    ["#E54ED0", "#080919"],
    ["#080919", "#E54ED0"],
    ["#FFE4F2", "#44008B"],
    ["#FFE4F2", "#00076F"],
  ])
    assert.ok(contrast(a, b) >= 4.5, `${a}/${b}: ${contrast(a, b)}`);
  assert.ok(contrast("#9F45B0", "#080919") < 4.5);
});
