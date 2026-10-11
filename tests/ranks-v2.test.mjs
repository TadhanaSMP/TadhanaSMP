import test from 'node:test';
import assert from 'node:assert/strict';
import { ranks,premiumRanks,premiumDuration } from '../src/data/ranks.ts';
import { store } from '../src/config/store.ts';
test('V2 rank snapshot preserves order and all threshold metrics',()=>{
 assert.deepEqual(ranks.map(r=>r.name),['NewComer','Traveler','Settler','Explorer','Adventurer','Pioneer','Guardian','Champion','Vanguard']);
 assert.deepEqual(ranks.map(r=>r.metrics.map(m=>m.value)),[[],[500,2,1500,25],[3000,8,8,5000,3000,500],[10000,20,20,15000,15000,150,15],[30000,50,40,40000,40000,500,30],[65000,90,70,80000,80000,25000,5000,100],[130000,150,110,150000,130000,50000,2500,50],[240000,220,160,250000,200000,100000,20000,5000],[400000,300,220,400000,300000,180000,40000,10000,300]]);
 assert.ok(ranks.slice(1).every(r=>r.metrics[0].label==='MoneyCost' && r.requirements.includes('in-game economy')));
 assert.ok(ranks.every(r=>r.perks===null));
});
test('premium prices stay separate, PHP monthly, exact merchant',()=>{
 assert.deepEqual(premiumRanks.map(r=>r.price),[199,299,499]);assert.equal(premiumDuration,'One month');assert.equal(store.currency,'PHP');assert.equal(store.billingPeriod,'month');assert.equal(store.officialUrl,'https://store.tadhanasmp.com');
});
