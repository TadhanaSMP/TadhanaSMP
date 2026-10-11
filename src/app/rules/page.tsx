import Link from "next/link";
import { PageHeading } from "@/components/PageHeading";
import { rules } from "@/data/rules";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Community rules",
  "Proposed TadhanaSMP community standards for respect, fair play, builds, and reporting.",
  "/rules",
  !site.rulesApproved,
);
export default function Rules() {
  return (
    <div className="container page">
      <PageHeading
        eyebrow="Community rules"
        title="Make it a good place to return to."
        description="A shared world works when we look after it, and each other."
      />
      {!site.rulesApproved && (
        <aside className="notice">
          <strong>Proposed guidelines / awaiting owner approval</strong>
          <p>
            These are draft community standards. Follow the currently approved
            server and Discord rules while they are being reviewed.
          </p>
        </aside>
      )}
      <div className="rules-list">
        {rules.map((rule, index) => (
          <article key={rule.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{rule.title}</h2>
              <p>{rule.text}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="page-next">
        <p>
          Moderation and appeals should use the authorized support route. Do not
          post private details or accuse players publicly.
        </p>
        <Link href="/support" className="text-link">
          Find community support →
        </Link>
      </div>
    </div>
  );
}
