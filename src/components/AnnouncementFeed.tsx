"use client";
import { AnnouncementText } from "./AnnouncementText";
import Link from "next/link";
import { useEffect, useState } from "react";
import { announcementsUrl, community } from "@/config/community";
type Item = {messageId:string;body:string;pinned:boolean;postedAt:string;syncedAt:string};
type Feed = {state:"pending"|"available"|"unavailable";lastSyncedAt:string|null;items:Item[];hasMore:boolean};
export function AnnouncementFeed({compact=false}:{compact?:boolean}) {
 const [feed,setFeed]=useState<Feed|null>(null),[page,setPage]=useState(1);
 useEffect(() => {
  let disposed=false, controller:AbortController|null=null;
  const read=async () => {
   if(document.hidden || controller) return;
   controller=new AbortController();
   const timer=setTimeout(()=>controller?.abort(),10000);
   try {const r=await fetch(`/api/announcements?page=${page}`,{signal:controller.signal,cache:"no-store"}); const data=await r.json(); if(!r.ok || !["pending","available","unavailable"].includes(data.state) || !Array.isArray(data.items)) throw new Error("invalid-feed"); if(!disposed)setFeed(data);}
   catch {if(!disposed)setFeed({state:"unavailable",lastSyncedAt:null,items:[],hasMore:false});}
   finally {clearTimeout(timer);controller=null;}
  };
  void read(); const interval=setInterval(()=>void read(),90000);
  const visible=()=>{if(document.hidden)controller?.abort();else void read();};
  document.addEventListener("visibilitychange",visible);
  return ()=>{disposed=true;clearInterval(interval);controller?.abort();document.removeEventListener("visibilitychange",visible);};
 },[page]);
 return <section className="announcement-feed" aria-label="Official Discord announcements">
 <p className="small muted" role="status">{!feed ? "Checking announcement availability…" : feed.state === "pending" ? "Announcement mirror pending bot configuration." : feed.state === "unavailable" ? "Updates temporarily unavailable." : feed.lastSyncedAt ? `Last received: ${new Date(feed.lastSyncedAt).toLocaleString("en-PH",{timeZone:community.timezone})} Philippine time` : "No announcements received yet."}</p>
 {feed?.state === "available" && feed.items.slice(0,compact?3:10).map(post => <article key={post.messageId} className="announcement-post">
 <p className="eyebrow">TadhanaSMP announcement{post.pinned ? " · Pinned" : ""}</p>
 <time dateTime={post.postedAt}>{new Date(post.postedAt).toLocaleString("en-PH",{timeZone:community.timezone})} Philippine time</time>
 <p className="announcement-body"><AnnouncementText text={compact && post.body.length > 320 ? post.body.slice(0,320)+"…" : post.body} /></p>{compact && <Link className="text-link" href="/news">Read website announcements →</Link>}
 <a className="text-link" href={`${announcementsUrl}/${post.messageId}`} target="_blank" rel="noopener noreferrer">Read Original in Discord ↗</a>
 </article>)}
 {feed?.state === "available" && !feed.items.length && <p>No approved announcements received on this page.</p>}
 {!compact && feed?.state === "available" && <div className="button-row"><button className="button button-ghost" disabled={page===1} onClick={()=>setPage(p=>p-1)}>Newer</button><span>Page {page}</span><button className="button button-ghost" disabled={!feed.hasMore} onClick={()=>setPage(p=>p+1)}>Older</button></div>}
 <a className="text-link" href={announcementsUrl} target="_blank" rel="noopener noreferrer">Open the announcements channel ↗</a>
 </section>;
}
