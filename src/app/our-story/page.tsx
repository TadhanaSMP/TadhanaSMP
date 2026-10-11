import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeading } from "@/components/PageHeading";
import { WorldImage } from "@/components/WorldImage";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Our story",
  "Discover the Filipino roots and shared Minecraft memories behind TadhanaSMP.",
  "/our-story",
);
export default function Story() {
  return (
    <div className="container page">
      <PageHeading
        eyebrow="Our story"
        title="A shared destiny. A world of our own."
        description="Tadhana is rooted in the idea of destiny. For us, that story is made in the moments we build together."
      />
      <div className="story-layout">
        <div className="prose" data-reveal>
          <p className="lead">
            A server can begin with an address. A community begins with people.
          </p>
          <p>
            TadhanaSMP is a Minecraft Java and Bedrock semi-vanilla survival
            community with Filipino roots. Building, trading, exploration, and
            long-term progression give us reasons to play. The people give us
            reasons to return.
          </p>
          <h2>Small moments make a shared world.</h2>
          <p>
            The archive captures something simple: players gathering on steps,
            wandering through gardens, and finding a place in a world they
            helped shape. These are real memories, preserved without inventing
            the names or stories behind them.
          </p>
          <h2>Your chapter is still unwritten.</h2>
          <p>
            You do not need a perfect plan to begin. Learn the active rules,
            find your rhythm, and make something worth coming back to.
          </p>
          <Link className="text-link" href="/play">
            Find your beginning
            <ArrowRight size={18} />
          </Link>
        </div>
        <figure data-reveal>
          <WorldImage id="cherry-gathering" contain />
          <figcaption>
            Players beneath pink branches, from the community archive.
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
