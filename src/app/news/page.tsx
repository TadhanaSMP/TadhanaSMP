import Link from "next/link";
import { Newspaper, ArrowUpRight } from "lucide-react";
import { PageHeading } from "@/components/PageHeading";
import { publicUpdates } from "@/data/updates";
import { readPublicConfig } from "@/config/server";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "News",
  "Official website updates and archived announcements from TadhanaSMP.",
  "/news",
);
export default function News() {
  const posts = publicUpdates(),
    config = readPublicConfig();
  return (
    <div className="container page">
      <PageHeading
        eyebrow="News"
        title="The next page of the story."
        description="Confirmed updates belong here. No guessed reopening dates, countdowns, or unannounced events."
      />
      {posts.length ? (
        <div className="news-list">
          {posts.map((post) => (
            <article key={post.slug}>
              <span className="eyebrow">
                {post.state === "historical"
                  ? "From the archive"
                  : "Community update"}
              </span>
              <h2>
                <Link href={`/news/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.summary}</p>
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-PH", {
                    timeZone: "UTC",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Newspaper size={32} />
          <h2>No website announcements yet.</h2>
          <p>
            For current server updates, use the official community announcement
            channel.
          </p>
          {config.discordUrl && (
            <a
              href={config.discordUrl}
              className="button button-ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Discord
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
