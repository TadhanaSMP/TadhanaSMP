import { premiumRanks, rankSource } from "@/data/ranks";
import { readPublicConfig } from "@/config/server";
import { store } from "@/config/store";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeading } from "@/components/PageHeading";
import { RankJourney } from "@/components/RankJourney";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Rank journey",
  "Follow TadhanaSMP’s nine earnable gameplay ranks, from NewComer to Vanguard.",
  "/ranks",
);
export default function Ranks() {
  const config = readPublicConfig();
  return (
    <div className="container page">
      <PageHeading
        eyebrow="Rank journey"
        title="Every chapter takes you further."
        description="Nine free gameplay ranks. Progress earned in the world, one step at a time."
      />
      <RankJourney />
      <p className="small muted">{rankSource.revision}. Actual gameplay configuration controls eligibility. <a href={rankSource.url} target="_blank" rel="noopener noreferrer">View source sheet ↗</a></p>
      {config.premiumPublished && <section className="store-content"><h2>Optional premium ranks</h2><p>Separate from earnable gameplay ranks. Owner-confirmed prices, one-month duration. Confirm current benefits and purchase terms at the official store.</p><div className="premium-ranks">{premiumRanks.map(rank=><article key={rank.name}><h3>{rank.name}</h3><p className="premium-price">PHP {rank.price}<span> / month</span></p><a className="text-link" href={store.officialUrl} target="_blank" rel="noopener noreferrer">View official store ↗</a></article>)}</div></section>}
      <div className="split-notes">
        <article>
          <span className="eyebrow">Your own pace</span>
          <h2>A journey, earned.</h2>
          <p>
            Requirements and benefits need to match the active server
            configuration. For current eligibility, check{" "}
            <code>/rankup</code> in game and follow the official guidance.
          </p>
        </article>
        <article>
          <span className="eyebrow">Keep the distinction clear</span>
          <h2>Gameplay and premium.</h2>
          <p>
            Free progression is separate from optional paid ranks. Premium
            products appear only through the approved official store when their
            current prices and terms are confirmed.
          </p>
          <Link href="/store" className="text-link">
            Official store information
            <ArrowRight size={18} />
          </Link>
        </article>
      </div>
    </div>
  );
}
