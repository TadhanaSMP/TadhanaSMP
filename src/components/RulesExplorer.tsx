"use client";
import { useId, useRef, useState } from "react";
import { ruleCollections } from "@/data/rules";
export function RulesExplorer({ initial = "server" }: { initial?: "server" | "staff" }) {
 const [selected, setSelected] = useState(initial), [query, setQuery] = useState("");
 const id = useId(), tabs = useRef<(HTMLButtonElement | null)[]>([]), keys = ["server", "staff"] as const;
 const collection = ruleCollections[selected], sections = collection.reviewed ? collection.sections.filter(s => `${s.heading} ${s.text}`.toLowerCase().includes(query.toLowerCase())) : [];
 return <div className="rules-explorer"><div className="edition-tabs" role="tablist" aria-label="Public rule collections">{keys.map((key,i) => <button key={key} ref={el => { tabs.current[i] = el; }} id={`${id}-${key}`} role="tab" aria-selected={selected === key} aria-controls={`${id}-panel`} tabIndex={selected === key ? 0 : -1} onClick={() => {setSelected(key); setQuery("");}} onKeyDown={e => {if (!["ArrowLeft","ArrowRight","Home","End"].includes(e.key)) return; e.preventDefault(); const next = e.key === "Home" ? 0 : e.key === "End" ? 1 : 1-i; setSelected(keys[next]); setQuery(""); tabs.current[next]?.focus();}}>{ruleCollections[key].label}</button>)}</div>
 <section role="tabpanel" tabIndex={0} id={`${id}-panel`} aria-labelledby={`${id}-${selected}`}><h2>{collection.label}</h2>
 {collection.reviewed && collection.sections.length ? <><label className="rules-search">Search these rules<input type="search" value={query} onChange={e => setQuery(e.target.value)} /></label><nav aria-label="Rules contents">{sections.map(s => <a className="text-link" key={s.id} href={`#${selected}-${s.id}`}>{s.heading}</a>)}</nav>{sections.map(s => <article className="rule-section" id={`${selected}-${s.id}`} key={s.id}><h3>{s.heading}</h3><p>{s.text}</p></article>)}{!sections.length && <p>No matching rules.</p>}{collection.updatedAt && <p>Reviewed <time dateTime={collection.updatedAt}>{collection.updatedAt}</time></p>}</> : <div className="empty-state"><h3>The approved rule text is awaiting source review.</h3><p>Use the original public {collection.label.toLowerCase()} while the website copy is being verified.</p></div>}
 <a className="button button-ghost" href={collection.sourceUrl} target="_blank" rel="noopener noreferrer">View Original in Discord ↗</a><p className="small muted">Discord may ask you to sign in. Public staff rules do not grant access to staff tools.</p>
 </section></div>;
}
