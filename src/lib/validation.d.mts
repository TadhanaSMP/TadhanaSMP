export function safeAddress(value?: string): string;
export function safePort(value?: string): number | null;
export function httpsUrl(value?: string): string;
export type StatusState = "online" | "offline" | "unknown" | "maintenance";
export function normalizeStatus(data: unknown): {
  state: StatusState;
  players: number | null;
  maximum: number | null;
};
export function approvedStatusUrl(value: string): string;
export function contrast(a: string, b: string): number;
