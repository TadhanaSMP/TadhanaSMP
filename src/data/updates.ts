export type Update = {
  slug: string;
  title: string;
  summary: string;
  body: string[];
  state: "published" | "historical" | "scheduled" | "postponed";
  publishedAt?: string;
};
// Add only owner-approved announcements. Scheduled and postponed items are not public articles.
export const updates: Update[] = [];
export const publicUpdates = () =>
  updates.filter(
    (post) => post.state === "published" || post.state === "historical",
  );
