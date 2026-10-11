import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { PageHeading } from "@/components/PageHeading";
import { readPublicConfig } from "@/config/server";
import { premiumRanks, premiumDuration } from "@/data/ranks";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Official store",
  "Availability and safe links for TadhanaSMP’s approved external store.",
  "/store",
  true,
);
export default function Store() {
  const config = readPublicConfig();
  return (
    <div className="container page">
      <PageHeading
        eyebrow="Official store"
        title="Support the story, clearly."
        description="Optional premium ranks are separate from free gameplay progression. Purchases belong on the verified official merchant site."
      />
      {config.storeUrl ? (
        <div className="store-content">
          <p>
            Review the merchant’s current product details, duration,
            fulfillment, and refund terms before buying.
          </p>
          {config.premiumPublished && (
            <div className="premium-ranks">
              {premiumRanks.map((rank) => (
                <article key={rank.name}>
                  <span className="eyebrow">{premiumDuration}</span>
                  <h2>{rank.name}</h2>
                  <p className="premium-price">
                    <span>PHP</span> {rank.price}
                  </p>
                  <p>
                    Confirm the current benefits and terms on the official
                    store.
                  </p>
                </article>
              ))}
            </div>
          )}
          <a
            className="button"
            href={config.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit the official store
            <ArrowUpRight size={16} />
          </a>
          <p className="small muted">
            Checkout and payment are handled by the external merchant. This
            website collects no payment details.
          </p>
        </div>
      ) : (
        <div className="empty-state">
          <ShoppingBag size={32} />
          <h2>The official store link is being reviewed.</h2>
          <p>
            Premium products and prices will appear only after the team confirms
            the current merchant and terms.
          </p>
          {config.discordUrl && (
            <a
              className="button button-ghost"
              href={config.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Check community announcements
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
