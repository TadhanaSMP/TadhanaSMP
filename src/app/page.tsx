import { AnnouncementFeed } from "@/components/AnnouncementFeed";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Compass,
  Users,
  ChevronDown,
} from "lucide-react";
import { readPublicConfig } from "@/config/server";
import { site } from "@/config/site";
import { WorldImage } from "@/components/WorldImage";
import { StatusIndicator } from "@/components/StatusIndicator";
import { CopyButton } from "@/components/CopyButton";
import { RankJourney } from "@/components/RankJourney";
import { pageMetadata } from "@/lib/metadata";
import { publicUpdates } from "@/data/updates";
export const metadata = pageMetadata(
  "Your story begins here",
  "Explore TadhanaSMP, a Minecraft survival community built on friendship, shared worlds, and lasting memories.",
  "/",
);
export default function Home() {
  const config = readPublicConfig();
  const latest = publicUpdates()[0];
  const java = config.javaAddress
    ? config.javaAddress
    : "";
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/images/memories/town-sign-1920.webp"
        imageSrcSet="/images/memories/town-sign-640.webp 640w, /images/memories/town-sign-1280.webp 1280w, /images/memories/town-sign-1920.webp 1920w"
        imageSizes="100vw"
      />
      <section className="hero">
        <WorldImage
          id="town-sign"
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-shade" />
        <div className="container hero-content">
          <div className="hero-eyebrow">
            <span className="tiny-star">✧</span> Tadhana / a shared destiny
          </div>
          <h1>
            Your story
            <br />
            begins <span>here.</span>
          </h1>
          <p>
            Some worlds are played.
            <br className="desktop-break" /> This one is written together.
          </p>
          <p className="hero-description">
            A Java + Bedrock survival community. Build a home, find your people,
            and leave a little of yourself in the world.
          </p>
          <div className="button-row">
            <Link href="/world" className="button">
              Explore the world
              <ArrowUpRight size={18} />
            </Link>
            {config.discordUrl && (
              <a
                href={config.discordUrl}
                className="button button-ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join our Discord
                <ArrowUpRight size={18} />
              </a>
            )}
          </div>
          <div className="hero-meta">
            <StatusIndicator
              config={config}
            />
            <span className="hero-meta-divider" />
            <Link href="/play?edition=java">
              Java + Bedrock
              <ArrowRight size={14} />
            </Link>
          </div>
          {(java || (config.bedrockAddress && config.bedrockPort)) && (
            <div className="hero-addresses">
              {java && (
                <div>
                  <span>Java</span>
                  <code>{java}</code>
                  <CopyButton value={java} />
                </div>
              )}
              {config.bedrockAddress && config.bedrockPort && (
                <div>
                  <span>Bedrock</span>
                  <code>{config.bedrockAddress}</code>
                  <CopyButton value={config.bedrockAddress} />
                  <span>Port {config.bedrockPort}</span>
                  <CopyButton
                    value={String(config.bedrockPort)}
                    label="Copy port"
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="container hero-bottom">
          <span>Survival · Economy · Community</span>
          <a href="#our-world" aria-label="Discover our world">
            Scroll to discover
            <ChevronDown size={16} />
          </a>
        </div>
      </section>
      {config.maintenance && (
        <aside className="maintenance-band">
          <div className="container">
            <span className="eyebrow">A pause in the story</span>
            <p>{config.maintenanceNotice}</p>
            <Link href="/status">
              Server updates
              <ArrowRight size={16} />
            </Link>
          </div>
        </aside>
      )}
      <section className="section container world-intro" id="our-world">
        <div className="section-topline">
          <span className="eyebrow">01 / A world of our own</span>
          <span className="tiny-star" aria-hidden="true">
            ✧
          </span>
        </div>
        <div className="world-intro-grid">
          <div className="world-intro-copy" data-reveal>
            <h2>
              Not just blocks.
              <br />
              <span className="muted">A place to belong.</span>
            </h2>
            <p>
              A path becomes familiar. A build becomes a landmark. A stranger
              becomes the friend waiting for you online.
            </p>
            <p>
              That’s the world we keep making: one home, one adventure, one
              shared moment at a time.
            </p>
            <Link className="text-link" href="/world">
              Step into our world
              <ArrowRight size={18} />
            </Link>
            <Image
              className="world-crest"
              src="/images/brand/crest.webp"
              alt=""
              width={492}
              height={512}
              sizes="140px"
              unoptimized
            />
          </div>
          <div className="world-intro-images" data-reveal>
            <figure className="world-main-image scene-zoom">
              <WorldImage id="village-sunset" />
              <figcaption>The last light, held in the archive.</figcaption>
            </figure>
            <figure className="world-detail-image">
              <WorldImage id="library" sizes="(max-width: 800px) 70vw, 24vw" />
              <figcaption>A room for stories.</figcaption>
            </figure>
            <span className="orbit-mark" aria-hidden="true" />
          </div>
        </div>
      </section>
      <section className="container at-a-glance section">
        <div className="section-topline">
          <span className="eyebrow">02 / Make it your own</span>
          <Link className="text-link" href="/features">
            All features
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="feature-columns">
          <article data-reveal>
            <Compass size={26} />
            <h3>Find your way.</h3>
            <p>
              Semi-vanilla survival, exploration, and the freedom to build your
              own rhythm.
            </p>
            <span>Explore / Build</span>
          </article>
          <article data-reveal>
            <Sparkles size={26} />
            <h3>Make your mark.</h3>
            <p>
              A player economy, jobs, and a gameplay rank journey built for
              long-term progress.
            </p>
            <span>Trade / Progress</span>
          </article>
          <article data-reveal>
            <Users size={26} />
            <h3>Find your people.</h3>
            <p>
              Java and Bedrock. Different beginnings, a shared world, and room
              for your story.
            </p>
            <span>Connect / Belong</span>
          </article>
        </div>
      </section>
      <section className="community-scene section container">
        <div className="community-heading" data-reveal>
          <span className="eyebrow">03 / The people behind the world</span>
          <h2>
            Built by players.
            <br />
            <span className="pink">Remembered together.</span>
          </h2>
          <p>The best part of the world was never the scenery.</p>
        </div>
        <figure data-reveal>
          <WorldImage id="dock-gathering" sizes="100vw" contain />
          <figcaption>
            <span>From the community archive</span>
            <Link href="/our-story">
              Meet our story
              <ArrowRight size={16} />
            </Link>
          </figcaption>
        </figure>
      </section>
      <section className="container section memory-preview">
        <div className="section-topline">
          <div>
            <span className="eyebrow">
              04 / Little moments, lasting stories
            </span>
            <h2>Keep a piece of it.</h2>
          </div>
          <Link href="/memories" className="text-link">
            Explore memories
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="memory-preview-grid">
          {[
            { id: "cherry-gathering", title: "A moment in good company." },
            { id: "front-steps", title: "Everyone has a place." },
            { id: "garden", title: "Take the scenic route." },
          ].map((item) => (
            <Link
              href="/memories"
              key={item.id}
              className="memory-preview-item"
              data-reveal
            >
              <WorldImage
                id={item.id}
                sizes="(max-width: 600px) 100vw, 33vw"
                contain={item.id !== "garden"}
              />
              <span>
                {item.title}
                <ArrowUpRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="container section">
        <div className="section-topline">
          <span className="eyebrow">05 / A journey, earned</span>
          <Link href="/ranks" className="text-link">
            Rank guide
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="rank-intro" data-reveal>
          <h2>
            Every chapter
            <br />
            takes you further.
          </h2>
          <p>
            Nine gameplay ranks. One long story.
            <br />
            Begin as NewComer and discover what comes next.
          </p>
        </div>
        <RankJourney />
      </section>
      <section className="container section home-play">
        <div data-reveal>
          <span className="eyebrow">06 / Your next chapter</span>
          <h2>
            Two editions.
            <br />
            One shared world.
          </h2>
          <p>
            Choose your edition. The play guide shows verified addresses,
            separate ports, and the next steps.
          </p>
          <Link className="text-link" href="/play">
            How to play
            <ArrowRight size={18} />
          </Link>
        </div>
        <div className="edition-links" data-reveal>
          <Link href="/play?edition=java">
            <span>01 / Desktop</span>
            <h3>Java Edition</h3>
            <ArrowUpRight size={26} />
          </Link>
          <Link href="/play?edition=bedrock">
            <span>02 / Supported platforms</span>
            <h3>Bedrock Edition</h3>
            <ArrowUpRight size={26} />
          </Link>
        </div>
      </section>
      <section className="container home-news" data-reveal>
        <div>
          <p className="eyebrow">07 / The next page</p>
          <h2>Keep the next chapter close.</h2>
        </div>
        <div>
          <p>
            {latest
              ? latest.summary
              : "Confirmed website announcements will appear here. Follow official Discord announcements for current server updates."}
          </p>
          <Link
            className="text-link"
            href={latest ? `/news/${latest.slug}` : "/news"}
          >
            {latest ? latest.title : "Visit community news"}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <section className="container home-announcements"><h2>From the community.</h2><AnnouncementFeed compact /></section>
      <section className="closing-scene">
        <WorldImage
          id="town-gathering"
          className="closing-image"
          contain
          sizes="100vw"
        />
        <div className="closing-shade" />
        <div className="container closing-content">
          <span className="eyebrow">There’s room for your story.</span>
          <h2>
            Come for the world.
            <br />
            Stay for the people.
          </h2>
          <div className="button-row">
            {config.discordUrl && (
              <a
                href={config.discordUrl}
                className="button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Find us on Discord
                <ArrowUpRight size={18} />
              </a>
            )}
            <Link href="/play" className="button button-ghost">
              How to play
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="closing-links">
            <Link href="/memories">Explore memories</Link>
            <Link href="/rules">Read the rules</Link>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: site.name,
            url: site.url,
            description: site.description,
          }).replace(/</g, "\u003c"),
        }}
      />
    </>
  );
}
