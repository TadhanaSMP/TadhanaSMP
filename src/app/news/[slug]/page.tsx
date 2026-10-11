import Link from "next/link";
import { notFound } from "next/navigation";
import { publicUpdates } from "@/data/updates";
import { pageMetadata } from "@/lib/metadata";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = publicUpdates().find((p) => p.slug === slug);
  if (!post) return {};
  return pageMetadata(post.title, post.summary, `/news/${post.slug}`);
}
export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = publicUpdates().find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <article className="container page article-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/news">News</Link>
      </nav>
      <p className="eyebrow">
        {post.state === "historical"
          ? "Historical announcement"
          : "Community update"}
      </p>
      <h1>{post.title}</h1>
      <p className="lead">{post.summary}</p>
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
      <div className="prose">
        {post.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <Link href="/news" className="text-link">
        Back to all updates →
      </Link>
    </article>
  );
}
