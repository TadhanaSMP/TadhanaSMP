import Link from "next/link";
import { PageHeading } from "@/components/PageHeading";
import { faq } from "@/data/faq";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Frequently asked questions",
  "Answers about TadhanaSMP, Minecraft editions, server addresses, ranks, and community support.",
  "/faq",
);
export default function FAQ() {
  return (
    <div className="container page">
      <PageHeading
        eyebrow="FAQ"
        title="A few things before you begin."
        description="Practical answers for your next chapter in TadhanaSMP."
      />
      <div className="accordions faq-list">
        {faq.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
      <div className="page-next">
        <p>
          Still need a hand? Ask through the official community support route.
        </p>
        <Link href="/support" className="text-link">
          Get support →
        </Link>
      </div>
    </div>
  );
}
