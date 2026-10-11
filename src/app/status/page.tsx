import { PageHeading } from "@/components/PageHeading";
import { StatusIndicator } from "@/components/StatusIndicator";
import { readPublicConfig } from "@/config/server";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Server status",
  "Check confirmed TadhanaSMP maintenance notices and available live server status.",
  "/status",
);
export default function Status() {
  const config = readPublicConfig();
  return (
    <div className="container page">
      <PageHeading
        eyebrow="Server status"
        title="Know before you connect."
        description="A clear view of the server’s availability. Java and Bedrock are checked independently. Maintenance notices are shown separately."
      />
      <div className="status-layout">
        <StatusIndicator
          expanded
          config={config}
        />
        <div className="prose">
          <h2>Keep the latest chapter close.</h2>
          <p>
            Current connection details live in the play guide. Reopening dates
            appear only after they are confirmed by the team.
          </p>
          {config.discordUrl && (
            <a
              className="text-link"
              href={config.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Official Discord announcements ↗
            </a>
          )}
          <p className="small muted">
            Live data, when available, is cached briefly. An unavailable status
            does not mean the server is offline.
          </p>
        </div>
      </div>
    </div>
  );
}
