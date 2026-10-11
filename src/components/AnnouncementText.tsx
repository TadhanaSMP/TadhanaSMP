import { Fragment } from "react";
// Deliberately small Markdown subset. React escapes all text. No HTML parser.
export function AnnouncementText({text}:{text:string}) {
 const tokens=text.split(/(\[[^\]\n]{1,200}\]\(https:\/\/[^\s)]{1,1000}\)|\*\*[^*\n]{1,300}\*\*|`[^`\n]{1,300}`)/g);
 return <>{tokens.map((token,index)=>{
  const link=token.match(/^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/);
  if(link){try{const url=new URL(link[2]);if(!url.username && !url.password && url.protocol==="https:")return <a key={index} href={url.href} target="_blank" rel="noopener noreferrer">{link[1]}</a>;}catch{/* Malformed links stay text. */}}
  if(token.startsWith('**') && token.endsWith('**'))return <strong key={index}>{token.slice(2,-2)}</strong>;
  if(token.startsWith('`') && token.endsWith('`'))return <code key={index}>{token.slice(1,-1)}</code>;
  return <Fragment key={index}>{token}</Fragment>;
 })}</>;
}
