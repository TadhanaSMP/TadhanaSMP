import Link from "next/link";
import { Sparkles } from "lucide-react";
export default function NotFound() {
  return (
    <div className="container page not-found">
      <Sparkles size={42} />
      <p className="eyebrow">404 / An unwritten path</p>
      <h1>
        This path wasn’t
        <br />
        written into our story.
      </h1>
      <p>Let’s find you a familiar place to begin again.</p>
      <div className="button-row">
        <Link className="button" href="/">
          Back to home
        </Link>
        <Link className="button button-ghost" href="/world">
          Explore the world
        </Link>
        <Link className="text-link" href="/memories">
          Community memories →
        </Link>
      </div>
    </div>
  );
}
