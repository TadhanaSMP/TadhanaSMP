import { PageHeading } from "@/components/PageHeading";
import { Gallery } from "@/components/Gallery";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Memories",
  "Browse real TadhanaSMP community screenshots, builds, and landscapes in an accessible image gallery.",
  "/memories",
);
export default function Memories() {
  return (
    <div className="container page">
      <PageHeading
        eyebrow="Memories"
        title="The world changes. The moments stay."
        description="Real screenshots from the community archive. Find a scene, open a memory, and take a little time to look closer."
      />
      <Gallery />
      <p className="archive-note">
        Captions describe what is visible. Filenames do not establish event
        dates, locations, or builder attribution. For media concerns, contact
        community support.
      </p>
    </div>
  );
}
