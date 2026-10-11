import { ArrowUpRight } from "lucide-react";
import { PageHeading } from "@/components/PageHeading";
import { Verification } from "@/components/Verification";
import { readPublicConfig } from "@/config/server";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Support & verification",
  "Find official TadhanaSMP community support and secure Discord membership verification.",
  "/support",
  true,
);
export default async function Support({
  searchParams,
}: {
  searchParams: Promise<{ auth?: string }>;
}) {
  const config = readPublicConfig(),
    params = await searchParams;
  return (
    <div className="container page">
      <PageHeading
        eyebrow="Support & verification"
        title="You don’t have to figure it out alone."
        description="Connection trouble, a community question, or a moderation appeal? Start with the official support route."
      />
      {params.auth === "failed" && (
        <aside className="notice" role="alert">
          <strong>Discord sign-in could not be completed.</strong>
          <p>
            Please try again when verification is available. No account was
            created from this attempt.
          </p>
        </aside>
      )}
      <div className="support-layout">
        <div>
          <span className="eyebrow">Community support</span>
          <h2>Find us on Discord.</h2>
          <p>
            Follow the server’s support instructions and authorized staff
            guidance. This website does not accept tickets or appeal
            submissions.
          </p>
          {config.discordUrl ? (
            <a
              href={config.discordUrl}
              className="button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open community Discord
              <ArrowUpRight size={16} />
            </a>
          ) : (
            <p className="notice-inline">
              The community invite is currently being updated.
            </p>
          )}
        </div>
        <div className="support-checklist">
          <h3>A little context helps.</h3>
          <ul>
            <li>Your Minecraft edition and client version.</li>
            <li>The exact error message or a relevant screenshot.</li>
            <li>What you tried before the problem appeared.</li>
            <li>For appeals, a calm explanation and relevant evidence.</li>
          </ul>
          <p>
            Share sensitive details privately. Never send passwords, account
            tokens, or a verification code to an unknown person.
          </p>
        </div>
      </div>
      <Verification />
    </div>
  );
}
