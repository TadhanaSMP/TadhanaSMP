import { RulesPage } from "@/components/RulesPage";
import { pageMetadata } from "@/lib/metadata";
import { ruleCollections } from "@/data/rules";
export const metadata = pageMetadata("Server Rules", "Public TadhanaSMP server rules and original source.", "/rules/server", !ruleCollections.server.reviewed);
export default function Page() { return <RulesPage initial="server" />; }
