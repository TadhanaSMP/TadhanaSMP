export const ranks = [
  "NewComer",
  "Traveler",
  "Settler",
  "Explorer",
  "Adventurer",
  "Pioneer",
  "Guardian",
  "Champion",
  "Vanguard",
].map((name, index) => ({
  name,
  index,
  requirements: null as string | null,
  perks: null as string | null,
}));
export const premiumRanks = [
  { name: "Ascendant", price: 199 },
  { name: "Mythic", price: 299 },
  { name: "Legend", price: 499 },
];
export const premiumDuration = "One month";
