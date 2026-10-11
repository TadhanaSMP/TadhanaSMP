import Link from "next/link";
import { PageHeading } from "@/components/PageHeading";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Privacy",
  "How the TadhanaSMP website handles Discord identity, necessary cookies, and privacy requests.",
  "/privacy",
  !site.legalReviewed,
);
export default function Privacy() {
  return (
    <div className="container page legal-page">
      <PageHeading
        eyebrow="Privacy"
        title="Your information deserves care."
        description="A clear account of what this website is designed to process and what still needs owner review."
      />
      {!site.legalReviewed && (
        <aside className="notice">
          <strong>Draft policy / awaiting owner review</strong>
          <p>
            Operator details, hosting arrangements, legal basis, retention
            schedules, age policy, and the privacy request process require
            confirmation before public release.
          </p>
        </aside>
      )}
      <div className="prose">
        <h2>Information this website processes</h2>
        <p>
          Browsing the public pages does not require an account. When Discord
          sign-in is enabled, the website receives your Discord identifier,
          username, display name, and avatar reference. It stores those details
          with a hashed session identifier, expiration time, and verification
          state. It does not request your email address.
        </p>
        <h2>Why it is used</h2>
        <p>
          These details connect a website session to your Discord identity and
          support membership verification. One-time verification records are
          tied to a Discord identifier. The database stores a keyed hash of new
          verification codes and an unrelated placeholder in the legacy code
          field.
        </p>
        <h2>Cookies and tracking</h2>
        <p>
          Necessary cookies protect sign-in and hold an opaque session
          identifier. No optional analytics or marketing trackers are installed.
          Read the <Link href="/cookies">cookie policy</Link> for names and
          lifetimes.
        </p>
        <h2>Retention and security</h2>
        <p>
          Website sessions expire after 24 hours; sign-in state expires after
          ten minutes. Unused verification codes expire after ten minutes.
          Expired records need the operator’s scheduled cleanup. Used
          verification records are retained as membership proof until the owner
          approves a retention and revocation policy. Access is restricted to
          the backend; credentials and codes must not be placed in public logs.
        </p>
        <h2>Public announcement mirror</h2>
        <p>When configured, the existing Discord bot sends selected public channel announcements to the website. The website stores message IDs, sanitized text, source channel IDs, dates, pin state and sync times. Deleted posts become empty tombstones to prevent delayed updates from restoring removed content. Personal author profiles and attachment files are not copied. Retention and request handling need operator approval. Source links lead back to Discord.</p>
        <h2>External services and technical logs</h2>
        <p>
          Discord handles its own accounts and services under its own policies.
          Hosting and database providers may process technical access logs. The
          owner must identify actual providers, regions, access controls, and
          retention before this policy is approved. External social and store
          links lead to services with separate policies.
        </p>
        <h2>Support, purchases, and privacy requests</h2>
        <p>
          This website has no ticket, appeal, or payment form. Support happens
          through the official community route; purchases, when available,
          happen through the approved merchant. Use{" "}
          <Link href="/support">community support</Link> to request the current
          privacy contact while the dedicated contact and request process are
          being confirmed.
        </p>
        <h2>Participation and younger players</h2>
        <p>
          The operator must confirm its participation and age policies,
          including the rules of external services and applicable law. Do not
          submit private information about other players or children through
          public community channels.
        </p>
        <h2>Review and changes</h2>
        <p>
          The owner must review this text against the actual processing
          operations and relevant jurisdictions before adopting it. Approved
          changes should be dated and communicated through the official
          community channels.
        </p>
      </div>
    </div>
  );
}
