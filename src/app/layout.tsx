import type { Metadata } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "./globals.css";
import { site } from "@/config/site";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Motion } from "@/components/Motion";
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "TadhanaSMP | Your story begins here",
    template: "%s | TadhanaSMP",
  },
  description: site.description,
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
  openGraph: {
    title: "TadhanaSMP | Your story begins here",
    description: site.description,
    type: "website",
    locale: site.locale,
    url: site.url,
    images: [{ url: site.socialImage, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: [site.socialImage] },
  alternates: { canonical: "/" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navigation />
        <main id="main">{children}</main>
        <Footer />
        <Motion />
      </body>
    </html>
  );
}
