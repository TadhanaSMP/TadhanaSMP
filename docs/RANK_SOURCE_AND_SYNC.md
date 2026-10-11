# Rank source reconciliation

src/data/ranks.ts contains the exact owner-confirmed V2 sheet snapshot from 11 October 2026. Source: TadhanaSMP - Revamp, IN-GAME AND PREMIUM RANKS, https://docs.google.com/spreadsheets/d/1wd0g6fM2M6kNGBFqOqgNhUJQuEdHympXHINBY_VPk80/edit.

Nine ranks: NewComer, Traveler, Settler, Explorer, Adventurer, Pioneer, Guardian, Champion, Vanguard. All MoneyCost, playtime, Jobs combined total level and gameplay statistics in the V2 brief are populated. MoneyCost is game currency, never USD/PHP. Premium prices are separately PHP 199/299/499 per month, for Ascendant/Mythic/Legend. No unconfirmed perks are assigned.

The current sheet could not be re-read through the web tool in this resumed run. The deployed CMI configuration and current store product details were not supplied. This is the confirmed V2 snapshot, not a verified live CMI import or player-achievement feed.

Before launch compare current sheet cells against actual active CMI RankUp settings. Preserve units and thresholds. Report differences to the owner, then update metrics centrally after confirmation and change rankSource.revision to the actual approved review date. Check every rank tab and keyboard control. Update premium prices/duration only after owner confirmation and verify merchant terms. Keep optional premiums separate from free gameplay ranks. Official store href comes from src/config/store.ts.

rankSource.active is an owner-controlled gameplay publication flag. PREMIUM_RANKS_PUBLISHED hides premium cards without removing the official merchant link. Gameplay configuration determines real eligibility. The website never reports current player completion.
