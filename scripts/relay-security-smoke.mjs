import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {randomBytes,randomUUID} from 'node:crypto';
import {setTimeout as delay} from 'node:timers/promises';
import {signRelay,GUILD,CHANNEL} from '../src/lib/announcements-core.mjs';
const listener=createServer();await new Promise(resolve=>listener.listen(0,'127.0.0.1',resolve));const port=listener.address().port;await new Promise(resolve=>listener.close(resolve));
const secret=randomBytes(32).toString('hex'),origin=`http://127.0.0.1:${port}`;
let logs='';const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{env:{...process.env,AUTH_ENABLED:'false',ANNOUNCEMENTS_ENABLED:'true',DISCORD_INGEST_HMAC_SECRET:secret,DATABASE_URL:'postgresql://unused:unused@127.0.0.1:1/unused'},stdio:['ignore','pipe','pipe']});
child.stdout.on('data',d=>{logs+=d;});child.stderr.on('data',d=>{logs+=d;});
async function request(body,changes={}){const stamp=String(Date.now()),nonce=randomUUID();return fetch(origin+'/api/announcements/ingest',{method:'POST',headers:{'Content-Type':'application/json','x-relay-timestamp':stamp,'x-relay-nonce':nonce,'x-relay-signature':signRelay(body,stamp,nonce,secret),...changes},body,signal:AbortSignal.timeout(10000)});}
try {
 let ready=false;for(let i=0;i<50;i++){try{if((await fetch(origin+'/api/config')).ok){ready=true;break;}}catch{/* Startup pending. */}await delay(100);}assert.ok(ready);
 const value={operation:'upsert',guildId:GUILD,channelId:CHANNEL,messageId:'900060273258405999',eventAt:Date.now(),content:'Test only',pinned:false},body=JSON.stringify(value);
 assert.equal((await request(body,{'x-relay-signature':'0'.repeat(64)})).status,401);
 assert.equal((await request(body,{'x-relay-timestamp':String(Date.now()-600000)})).status,401);
 const stamp=String(Date.now()),nonce=randomUUID();assert.equal((await request(body+' ',{'x-relay-timestamp':stamp,'x-relay-nonce':nonce,'x-relay-signature':signRelay(body,stamp,nonce,secret)})).status,401);
 assert.equal((await request(JSON.stringify({...value,channelId:'123456789012345678'}))).status,400);
 assert.equal((await request(JSON.stringify({...value,messageId:Number(value.messageId)}))).status,400);
 assert.equal((await request(JSON.stringify({...value,content:'TOKEN=private_sample'}))).status,400);
 assert.equal((await request('x'.repeat(33000))).status,413);
 assert.equal((await request(body,{'Content-Type':'text/plain'})).status,415);
 assert.doesNotMatch(logs,/PrismaClientInitializationError|Unhandled|TypeError|ReferenceError/);
 console.log('PASS: 8 production relay rejection cases before database access. Valid ingestion, real replay and database concurrency require staging.');
} finally {child.kill('SIGTERM');await new Promise(resolve=>child.exitCode!==null?resolve():child.once('exit',resolve));}
