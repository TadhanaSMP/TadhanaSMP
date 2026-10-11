import { RulesPage } from "@/components/RulesPage";
import { pageMetadata } from "@/lib/metadata";
import { ruleCollections } from "@/data/rules";
export const metadata = pageMetadata("Staff Rules", "Public TadhanaSMP staff rules and original source.", "/rules/staff", !ruleCollections.staff.reviewed);
export default function Page() { return <RulesPage initial="staff" />; }
