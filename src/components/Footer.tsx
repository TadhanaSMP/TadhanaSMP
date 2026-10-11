import Link from "next/link";
import Image from "next/image";
import { navigation } from "@/data/navigation";
import { socials } from "@/config/socials";
import { readPublicConfig } from "@/config/server";
import { CookiePreferences } from "./CookiePreferences";
import { CopyButton } from "./CopyButton";
export function Footer() {
  const config = readPublicConfig();
  const java = config.javaAddress
    ? config.javaAddress
    : "";
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Link href="/" aria-label="TadhanaSMP home">
            <Image
              src="/images/brand/wordmark.webp"
              alt="TadhanaSMP"
              width={1100}
              height={449}
              sizes="200px"
              unoptimized
            />
          </Link>
          <p>
            A world of our own.
            <br />A story we share.
          </p>
          <div className="social-links">
            {config.discordUrl && (
              <a
                href={config.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord ↗
              </a>
            )}
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.label} ↗
              </a>
            ))}
            {config.storeUrl && (
              <a
                href={config.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Official store ↗
              </a>
            )}
          </div>
          {java && (
            <div className="footer-address">
              <span>Java</span>
              <code>{java}</code>
              <CopyButton value={java} />
            </div>
          )}
          {config.bedrockAddress && config.bedrockPort && (
            <div className="footer-address">
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
        <div className="footer-links">
          {navigation.map((group) => (
            <nav key={group.label} aria-label={`${group.label} footer`}>
              <h2>{group.label}</h2>
              {group.links.map((link) => (
                <Link key={link.href} href={link.href} target={link.href.startsWith("https:") ? "_blank" : undefined} rel={link.href.startsWith("https:") ? "noopener noreferrer" : undefined}>
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
      </div>
      <div className="container footer-bottom">
        <div>
          <p>© {new Date().getFullYear()} TadhanaSMP.</p>
          <p>
            An independent Minecraft community. Not affiliated with Mojang or
            Microsoft. Minecraft is a trademark of Mojang.
          </p>
        </div>
        <CookiePreferences />
      </div>
    </footer>
  );
}
