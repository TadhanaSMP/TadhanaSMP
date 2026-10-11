import { PageHeading } from "./PageHeading";
import { RulesExplorer } from "./RulesExplorer";
export function RulesPage({ initial = "server" }: { initial?: "server" | "staff" }) {
 return <div className="container page"><PageHeading eyebrow="Public rules" title="A shared world. Clear expectations." description="Server Rules and Staff Rules, with direct links to their original public sources." /><RulesExplorer initial={initial} /></div>;
}
