export const community = { guildId: "713039494496124938", announcementChannelId: "900060273258405999", serverRulesChannelId: "1358628948636073994", staffRulesChannelId: "1358629101451350217", announcementMode: "bot-relay", timezone: "Asia/Manila" } as const;
export const channelUrl = (id: string) => `https://discord.com/channels/${community.guildId}/${id}`;
export const announcementsUrl = channelUrl(community.announcementChannelId);
