import Link from "next/link";
import { PageHeading } from "@/components/PageHeading";
import { PlayGuide } from "@/components/PlayGuide";
import { readPublicConfig } from "@/config/server";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "How to play",
  "Connect to TadhanaSMP from Minecraft Java or Bedrock with edition-specific addresses, ports, and setup guidance.",
  "/play",
);
export default async function Play({
  searchParams,
}: {
  searchParams: Promise<{ edition?: string }>;
}) {
  const config = readPublicConfig();
  const params = await searchParams;
  const edition = params.edition === "bedrock" ? "bedrock" : "java";
  return (
    <div className="container page">
      <PageHeading
        eyebrow="How to play"
        title="Your next chapter starts here."
        description="Choose your edition. Keep the address and port together, and use a supported version before joining."
      />
      {config.maintenance && (
        <aside className="notice">
          <strong>Under maintenance</strong>
          <p>{config.maintenanceNotice}</p>
        </aside>
      )}
      <PlayGuide key={edition} config={config} initialEdition={edition} />
      <section className="help-section">
        <div>
          <span className="eyebrow">A little help along the way</span>
          <h2>Having trouble connecting?</h2>
        </div>
        <div className="accordions">
          <details>
            <summary>The address does not work</summary>
            <p>
              Check that you selected the right edition, copied the full
              address, and used its correct port. Follow official announcements
              during maintenance rather than using an old server listing.
            </p>
          </details>
          <details>
            <summary>Minecraft says the server is outdated</summary>
            <p>
              Compare your client version with the supported range above. If the
              range is not confirmed, check the latest official announcement
              before changing versions.
            </p>
          </details>
          <details>
            <summary>I am on a console</summary>
            <p>
              Console Bedrock editions may not offer Add Server for arbitrary
              addresses. Platform-specific options vary. Contact community
              support for currently supported guidance.
            </p>
          </details>
          <details>
            <summary>I need more help</summary>
            <p>
              Visit <Link href="/support">support</Link> and use the official
              Discord route. Share screenshots privately and never share
              passwords or account tokens.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
