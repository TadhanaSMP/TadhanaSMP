import { randomUUID } from 'node:crypto';
import { signRelay, GUILD, CHANNEL } from '../src/lib/announcements-core.mjs';
// Import into the EXISTING bot runtime. Never run a Gateway client in Next.js.
export async function relayAnnouncement(payload) {
 if(payload.guildId !== GUILD || payload.channelId !== CHANNEL)return {state:'ignored-source'};
 const endpoint=process.env.WEBSITE_ANNOUNCEMENT_INGEST_URL,secret=process.env.DISCORD_INGEST_HMAC_SECRET;
 const url=new URL(endpoint || 'https://invalid.example');
 if(!endpoint || url.protocol!=='https:' || url.username || url.password || url.pathname!=='/api/announcements/ingest' || !secret || secret.length<32)throw new Error('Relay not configured');
 const body=JSON.stringify(payload);
 for(let attempt=0;attempt<3;attempt++){
  const timestamp=String(Date.now()),nonce=randomUUID();
  try {
   const response=await fetch(url,{method:'POST',redirect:'error',signal:AbortSignal.timeout(12000),headers:{'Content-Type':'application/json','x-relay-timestamp':timestamp,'x-relay-nonce':nonce,'x-relay-signature':signRelay(body,timestamp,nonce,secret)},body});
   if(response.ok)return {state:'delivered'};
   if(response.status!==429 && response.status<500)throw new Error('Relay permanently rejected');
  } catch(error){if(error.message==='Relay permanently rejected')throw error;}
  if(attempt<2)await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)));
 }
 // Existing durable bot queue should catch this, retain payload and retry later.
 throw new Error('Relay delivery failed, retain in durable queue');
}
export function messageSnapshot(message, eventAt) {
 return {operation:'upsert',guildId:message.guildId,channelId:message.channelId,messageId:message.id,eventAt:eventAt ?? message.editedTimestamp ?? message.createdTimestamp,content:message.content || '',pinned:!!message.pinned,embeds:(message.embeds || []).map(embed=>({title:embed.title || '',description:embed.description || ''}))};
}
export function deletedSnapshot(message, eventAt=Date.now()) {
 return {operation:'delete',guildId:message.guildId,channelId:message.channelId,messageId:message.id,eventAt};
}
