// Temporary browser fixture; copy to src/app/qa-components/page.tsx, remove before final build.
"use client";
import { useEffect } from "react";
import { PageHeading } from "@/components/PageHeading";
import { PlayGuide } from "@/components/PlayGuide";
import type { PublicConfig } from "@/config/server";
const fixture: PublicConfig = {
  javaAddress: "java.example.test",
  javaPort: 25570,
  bedrockAddress: "bedrock.example.test",
  bedrockPort: 19133,
  supportedVersions: "TEST FIXTURE ONLY",
  maintenance: true,
  maintenanceNotice: "TEST: confirmed maintenance override.",
  discordUrl: "",
  storeUrl: "",
  premiumPublished: false,
};
export default function ClipboardFixture() {
  useEffect(() => {
    const original = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    return () => {
      if (original) Object.defineProperty(navigator, "clipboard", original);
      else Reflect.deleteProperty(navigator, "clipboard");
    };
  }, []);
  function deny() {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new DOMException("Test clipboard denial", "NotAllowedError");
        },
      },
    });
  }
  return (
    <div className="container page">
      <PageHeading
        eyebrow="Local QA fixture"
        title="Reserved test addresses."
        description="These are isolated test values, not real TadhanaSMP connection details."
      />
      <p>
        Copy the actual test values first. The denial fixture deliberately
        rejects the Clipboard promise and is never included as a public release
        route.
      </p>
      <div className="button-row" style={{ marginBlock: 25 }}>
        <button className="button button-ghost" onClick={deny}>
          Enable clipboard denial fixture
        </button>
      </div>
      <PlayGuide config={fixture} />
    </div>
  );
}
