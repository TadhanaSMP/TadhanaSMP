import { RulesPage } from "@/components/RulesPage";
import { pageMetadata } from "@/lib/metadata";
import { ruleCollections } from "@/data/rules";
export const metadata = pageMetadata("Public rules", "Public TadhanaSMP Server Rules and Staff Rules.", "/rules", !ruleCollections.server.reviewed);
export default function Page() { return <RulesPage />; }
