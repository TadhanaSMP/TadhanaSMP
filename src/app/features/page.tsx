import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeading } from "@/components/PageHeading";
import { WorldImage } from "@/components/WorldImage";
import { features } from "@/data/features";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Features",
  "Survival, a player economy, crossplay, exploration, and progression in TadhanaSMP.",
  "/features",
);
export default function Features() {
  return (
    <div className="container page">
      <PageHeading
        eyebrow="Features"
        title="Make the world your own."
        description="Familiar survival. Shared ambitions. The freedom to find your own reason to return."
      />
      <div className="feature-list">
        {features.map((item) => (
          <article key={item.number} data-reveal>
            <span className="feature-number">{item.number}</span>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
      <figure className="wide-scene" data-reveal>
        <WorldImage id="cherry-gateway" sizes="100vw" />
        <figcaption>
          Through the blossoms, from the community archive.
        </figcaption>
      </figure>
      <div className="page-next">
        <p>
          Specific commands, active activities, and feature availability can
          change. Use in-game guidance and official announcements for the
          current setup.
        </p>
        <Link href="/play" className="text-link">
          Choose your edition
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
