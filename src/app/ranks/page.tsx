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
  return (
    <div className="container page">
      <PageHeading
        eyebrow="Rank journey"
        title="Every chapter takes you further."
        description="Nine free gameplay ranks. Progress earned in the world, one step at a time."
      />
      <RankJourney />
      <div className="split-notes">
        <article>
          <span className="eyebrow">Your own pace</span>
          <h2>A journey, earned.</h2>
          <p>
            Requirements and benefits need to match the active server
            configuration. Until they are confirmed here, check{" "}
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
