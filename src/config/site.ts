import { httpsUrl } from "@/lib/validation.mjs";
export const site = {
  name: "TadhanaSMP",
  tagline: "Our world is written together.",
  locale: "en_PH",
  description:
    "A Minecraft Java and Bedrock semi-vanilla survival community rooted in friendship, exploration, and stories built together.",
  url: httpsUrl(process.env.SITE_URL) || "https://www.tadhanasmp.com",
  socialImage: "/images/social-preview.jpg",
  legalReviewed: false,
  rulesApproved: false,
  operator: null as string | null,
  privacyEmail: null as string | null,
};
