import type { Metadata } from "next";
import { site } from "@/config/site";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  noindex = false,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      locale: site.locale,
      type: "website",
      images: [
        {
          url: site.socialImage,
          width: 1200,
          height: 630,
          alt: "TadhanaSMP official wordmark over a real community build",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [site.socialImage],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
