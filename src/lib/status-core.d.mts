export type Probe = { status: "online" | "offline" | "unknown"; host: string; port: number | null; players: number | null; maximum: number | null; version: string | null; motd: string | null; checkedAt: string | null; retrievedAt: string; expiresAt: string | null; stale: boolean; reason: string | null; retryAt: string | null };
export const TTL: number;
export function cleanText(value: unknown, limit?: number): string | null;
export function unavailable(host: string, port: number | null, reason?: string, now?: number): Probe;
export function normalizeProbe(raw: unknown, host: string, port: number | null, now?: number, trusted?: boolean): Probe;
export function withStaleness(value: Probe, now?: number): Probe;
export function readBoundedBody(input: Request | Response, limit?: number, timeout?: number): Promise<string>;
export function createProbeCache(fetcher?: typeof fetch, clock?: () => number): (key: string, url: string, host: string, port: number | null, headers?: Record<string,string>, trusted?: boolean) => Promise<Probe>;
