import { community, channelUrl } from "@/config/community";
export type RuleSection = { id: string; heading: string; text: string; sourceMessageId: string };
export type RuleCollection = { label: string; sourceUrl: string; reviewed: boolean; updatedAt: string | null; sections: RuleSection[] };
export const ruleCollections: Record<"server" | "staff", RuleCollection> = {
 server: { label: "Server Rules", sourceUrl: channelUrl(community.serverRulesChannelId), reviewed: false, updatedAt: null, sections: [] },
 staff: { label: "Staff Rules", sourceUrl: channelUrl(community.staffRulesChannelId), reviewed: false, updatedAt: null, sections: [] },
};
