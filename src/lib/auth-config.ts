import "server-only";
import {
  configuredOrigin,
  authenticationReady,
  matchesOrigin,
} from "./auth-settings.mjs";
export function appOrigin() {
  return configuredOrigin(process.env, process.env.NODE_ENV === "production");
}
export function authReady() {
  return authenticationReady(
    process.env,
    process.env.NODE_ENV === "production",
  );
}
export function sameOrigin(request: Request) {
  return matchesOrigin(
    request.headers.get("origin"),
    process.env,
    process.env.NODE_ENV === "production",
  );
}
export function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}
export const unavailable = () =>
  json({ error: "authentication_unavailable", enabled: false }, 503);
