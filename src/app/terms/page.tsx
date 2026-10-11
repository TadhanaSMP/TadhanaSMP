import Link from "next/link";
import { PageHeading } from "@/components/PageHeading";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Terms",
  "Draft terms for the independent TadhanaSMP Minecraft community and its website.",
  "/terms",
  !site.legalReviewed,
);
export default function Terms() {
  return (
    <div className="container page legal-page">
      <PageHeading
        eyebrow="Terms"
        title="A shared world. Clear expectations."
        description="The community works best when everyone understands their part in its story."
      />
      {!site.legalReviewed && (
        <aside className="notice">
          <strong>Draft terms / awaiting owner review</strong>
          <p>
            These terms are a proposal. Operator identity, applicable
            jurisdiction, participation policy, moderation procedure, and
            purchase terms require approval before adoption.
          </p>
        </aside>
      )}
      <div className="prose">
        <h2>An independent community</h2>
        <p>
          TadhanaSMP is an independent fan-run Minecraft community. It is not
          affiliated with Mojang or Microsoft. Minecraft and associated
          trademarks belong to their respective owners.
        </p>
        <h2>Conduct and fair play</h2>
        <p>
          Follow the currently approved server and Discord rules. Respect other
          players, their privacy, builds, and accounts. Do not cheat, abuse
          exploits, harass people, or attempt unauthorized access. The{" "}
          <Link href="/rules">rules page</Link> clearly identifies proposals
          awaiting approval.
        </p>
        <h2>Your account and participation</h2>
        <p>
          You are responsible for keeping your accounts secure and following the
          participation requirements of Minecraft, Discord, and the community.
          Never share passwords, tokens, or codes with unknown people. The
          operator must confirm any age requirements and account policies.
        </p>
        <h2>Moderation, reports, and appeals</h2>
        <p>
          Use the official <Link href="/support">support route</Link> for
          reports and appeals. Staff procedures, evidence handling, and appeal
          rights must be confirmed by the owner. Do not publish another player’s
          private details.
        </p>
        <h2>Availability and changes</h2>
        <p>
          Server worlds, features, rules, and availability can change.
          Maintenance and technical issues may interrupt play. Reopening dates
          are published only when confirmed; no uninterrupted availability is
          promised.
        </p>
        <h2>Community creations and media</h2>
        <p>
          Respect the rights of players and other creators. Sharing a screenshot
          does not automatically grant unrestricted reuse rights. Contact
          support about attribution, permission, or removal concerns. Media
          should not reveal private player information.
        </p>
        <h2>Optional purchases</h2>
        <p>
          When an approved store is available, payment is handled by its
          external merchant. Read current product benefits, durations,
          fulfillment, refund terms, and merchant policies before buying. Free
          gameplay ranks are distinct from premium products. This website does
          not process payments.
        </p>
        <h2>External links, privacy, and revisions</h2>
        <p>
          External services have their own rules and policies. Read our{" "}
          <Link href="/privacy">privacy draft</Link> and{" "}
          <Link href="/cookies">cookie information</Link>. The owner must
          finalize legally appropriate terms and communicate adopted revisions
          through official channels.
        </p>
      </div>
    </div>
  );
}
