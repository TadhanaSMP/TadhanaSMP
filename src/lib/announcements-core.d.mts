export type RelayEvent = { messageId: string; guildId: string; channelId: string; operation: "upsert" | "delete"; eventAt: number; body: string; pinned: boolean; postedAt: string };
export const GUILD: string, CHANNEL: string;
export function signRelay(body:string,timestamp:string,nonce:string,secret:string):string;
export function verifyRelay(body:string,timestamp:string|null,nonce:string|null,signature:string|null,secret:string,now?:number):boolean;
export function normalizeEvent(raw:unknown,now?:number):RelayEvent;
export function safeAnnouncementText(value:unknown,limit?:number):string;
export function shouldApply(previous:{deletedAt:unknown;eventAt:bigint|number}|null,event:RelayEvent):boolean;
