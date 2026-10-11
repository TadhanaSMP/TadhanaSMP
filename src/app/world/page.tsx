import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeading } from "@/components/PageHeading";
import { WorldImage } from "@/components/WorldImage";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Our world",
  "Explore real archived TadhanaSMP village paths, interiors, and community architecture.",
  "/world",
);
const chapters = [
  {
    id: "village-sunset",
    title: "Follow the light.",
    subtitle: "01 / The paths between",
    text: "A winding path. Warm roofs. Water catching the sky. A world becomes home in the spaces between its landmarks.",
  },
  {
    id: "courtyard",
    title: "See the bigger picture.",
    subtitle: "02 / Built with intention",
    text: "Step back and the details become a pattern. The community archive holds a different view of the work that goes into a shared world.",
  },
  {
    id: "library",
    title: "Let the quiet in.",
    subtitle: "03 / A room for stories",
    text: "Bookshelves, timber, and hanging greenery. Some of the most memorable places are the ones that make you slow down.",
  },
  {
    id: "cherry-night",
    title: "Stay a little longer.",
    subtitle: "04 / After dark",
    text: "The light changes. The world takes on another character. Beneath the cherry branches, a familiar scene becomes something new.",
  },
];
export default function World() {
  return (
    <div className="container page">
      <PageHeading
        eyebrow="Our world"
        title="A world written together."
        description="Not a map to download. A collection of real places and details held in the TadhanaSMP archive."
      />
      <div className="world-chapters">
        {chapters.map((chapter, index) => (
          <article
            key={chapter.id}
            className={`world-chapter ${index % 2 ? "chapter-reverse" : ""}`}
            data-reveal
          >
            <figure className="scene-zoom">
              <WorldImage id={chapter.id} />
              <figcaption>Historical community screenshot</figcaption>
            </figure>
            <div>
              <p className="eyebrow">{chapter.subtitle}</p>
              <h2>{chapter.title}</h2>
              <p>{chapter.text}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="page-next">
        <p>
          These scenes come from the supplied community archive. Builds and
          access may change with the current server world.
        </p>
        <Link href="/memories" className="text-link">
          Explore the full archive
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
