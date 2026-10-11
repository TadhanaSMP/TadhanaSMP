// Temporary local browser fixture. Copy to src/app/qa-components/page.tsx for QA; remove before release.
import { PageHeading } from "@/components/PageHeading";
import { PlayGuide } from "@/components/PlayGuide";
import { readPublicConfig } from "@/config/server";
export default function Components() {
  const config = {
    ...readPublicConfig(),
    javaAddress: "java.example.test",
    javaPort: 25570,
    bedrockAddress: "bedrock.example.test",
    bedrockPort: 19133,
    supportedVersions: "TEST FIXTURE ONLY",
    maintenance: true,
    maintenanceNotice: "TEST: confirmed maintenance override.",
  };
  return (
    <div className="container page">
      <PageHeading
        eyebrow="Local QA fixture"
        title="Reserved test addresses."
        description="These are isolated test values, not real TadhanaSMP connection details."
      />
      <PlayGuide config={config} />
    </div>
  );
}
