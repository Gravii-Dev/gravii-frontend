import type { LeaderboardCategoryKey, LeaderboardRow } from "@/features/launch-app/types";

export const LEADERBOARD_CATEGORIES = ["Top Movers", "Power Users", "High Volume", "Rising Stars", "Trendsetters", "Most Active"] as const;

export const LEADERBOARDS: Record<LeaderboardCategoryKey, LeaderboardRow[]> = {
  0: [
    { rank: "1", tier: "Black", name: "Benji", id: "xxx...sfxx", change: "+1", up: true },
    { rank: "2", tier: "Black", name: "Diddy", id: "xxx...pxxx", change: "-1", up: false },
    { rank: "3", tier: "Platinum", name: "Satoshi", id: "xxx...a1b2", change: "+3", up: true },
    { rank: "4", tier: "Platinum", name: "Vitalik", id: "xxx...e4f5", change: "+2", up: true },
    { rank: "5", tier: "Platinum", name: "CZ", id: "xxx...g6h7", change: "-2", up: false },
    { rank: "6", tier: "Gold", name: "Punk6529", id: "xxx...i8j9", change: "+5", up: true },
    { rank: "7", tier: "Gold", name: "Cobie", id: "xxx...k0l1", change: "0", up: null },
    { rank: "8", tier: "Gold", name: "Hsaka", id: "xxx...m2n3", change: "+1", up: true },
    { rank: "9", tier: "Gold", name: "DCFgod", id: "xxx...o4p5", change: "-3", up: false },
    { rank: "10", tier: "Classic", name: "Ansem", id: "xxx...q6r7", change: "+4", up: true },
  ],
  1: [
    { rank: "1", tier: "Black", name: "Diddy", id: "xxx...pxxx", change: "+2", up: true },
    { rank: "2", tier: "Black", name: "Benji", id: "xxx...sfxx", change: "-1", up: false },
    { rank: "3", tier: "Platinum", name: "Vitalik", id: "xxx...e4f5", change: "0", up: null },
    { rank: "4", tier: "Platinum", name: "CZ", id: "xxx...g6h7", change: "+1", up: true },
    { rank: "5", tier: "Gold", name: "Hsaka", id: "xxx...m2n3", change: "+3", up: true },
    { rank: "6", tier: "Gold", name: "Punk6529", id: "xxx...i8j9", change: "-2", up: false },
    { rank: "7", tier: "Gold", name: "Cobie", id: "xxx...k0l1", change: "+1", up: true },
    { rank: "8", tier: "Platinum", name: "Satoshi", id: "xxx...a1b2", change: "-4", up: false },
    { rank: "9", tier: "Classic", name: "Ansem", id: "xxx...q6r7", change: "+2", up: true },
    { rank: "10", tier: "Classic", name: "GCR", id: "xxx...s8t9", change: "+1", up: true },
  ],
  2: [
    { rank: "1", tier: "Black", name: "Benji", id: "xxx...sfxx", change: "+3", up: true },
    { rank: "2", tier: "Platinum", name: "CZ", id: "xxx...g6h7", change: "+1", up: true },
    { rank: "3", tier: "Black", name: "Diddy", id: "xxx...pxxx", change: "-2", up: false },
    { rank: "4", tier: "Gold", name: "Cobie", id: "xxx...k0l1", change: "+4", up: true },
    { rank: "5", tier: "Platinum", name: "Vitalik", id: "xxx...e4f5", change: "-1", up: false },
    { rank: "6", tier: "Gold", name: "DCFgod", id: "xxx...o4p5", change: "+2", up: true },
    { rank: "7", tier: "Gold", name: "Hsaka", id: "xxx...m2n3", change: "0", up: null },
    { rank: "8", tier: "Platinum", name: "Satoshi", id: "xxx...a1b2", change: "-1", up: false },
    { rank: "9", tier: "Gold", name: "Punk6529", id: "xxx...i8j9", change: "+1", up: true },
    { rank: "10", tier: "Classic", name: "Ansem", id: "xxx...q6r7", change: "-3", up: false },
  ],
  3: [
    { rank: "1", tier: "Gold", name: "Ansem", id: "xxx...q6r7", change: "+8", up: true },
    { rank: "2", tier: "Gold", name: "Punk6529", id: "xxx...i8j9", change: "+6", up: true },
    { rank: "3", tier: "Gold", name: "Hsaka", id: "xxx...m2n3", change: "+5", up: true },
    { rank: "4", tier: "Classic", name: "GCR", id: "xxx...s8t9", change: "+4", up: true },
    { rank: "5", tier: "Classic", name: "Nova", id: "xxx...u0v1", change: "+12", up: true },
    { rank: "6", tier: "Platinum", name: "Satoshi", id: "xxx...a1b2", change: "+3", up: true },
    { rank: "7", tier: "Gold", name: "DCFgod", id: "xxx...o4p5", change: "+2", up: true },
    { rank: "8", tier: "Gold", name: "Cobie", id: "xxx...k0l1", change: "+1", up: true },
    { rank: "9", tier: "Black", name: "Benji", id: "xxx...sfxx", change: "0", up: null },
    { rank: "10", tier: "Black", name: "Diddy", id: "xxx...pxxx", change: "-1", up: false },
  ],
  4: [
    { rank: "1", tier: "Platinum", name: "Vitalik", id: "xxx...e4f5", change: "+2", up: true },
    { rank: "2", tier: "Black", name: "Benji", id: "xxx...sfxx", change: "0", up: null },
    { rank: "3", tier: "Gold", name: "Punk6529", id: "xxx...i8j9", change: "+4", up: true },
    { rank: "4", tier: "Black", name: "Diddy", id: "xxx...pxxx", change: "-1", up: false },
    { rank: "5", tier: "Platinum", name: "CZ", id: "xxx...g6h7", change: "+1", up: true },
    { rank: "6", tier: "Platinum", name: "Satoshi", id: "xxx...a1b2", change: "+3", up: true },
    { rank: "7", tier: "Gold", name: "Cobie", id: "xxx...k0l1", change: "-2", up: false },
    { rank: "8", tier: "Gold", name: "Hsaka", id: "xxx...m2n3", change: "+1", up: true },
    { rank: "9", tier: "Gold", name: "DCFgod", id: "xxx...o4p5", change: "0", up: null },
    { rank: "10", tier: "Classic", name: "Ansem", id: "xxx...q6r7", change: "+2", up: true },
  ],
  5: [
    { rank: "1", tier: "Black", name: "Diddy", id: "xxx...pxxx", change: "+1", up: true },
    { rank: "2", tier: "Black", name: "Benji", id: "xxx...sfxx", change: "+2", up: true },
    { rank: "3", tier: "Platinum", name: "CZ", id: "xxx...g6h7", change: "-1", up: false },
    { rank: "4", tier: "Gold", name: "Cobie", id: "xxx...k0l1", change: "+3", up: true },
    { rank: "5", tier: "Gold", name: "Hsaka", id: "xxx...m2n3", change: "+1", up: true },
    { rank: "6", tier: "Platinum", name: "Satoshi", id: "xxx...a1b2", change: "-2", up: false },
    { rank: "7", tier: "Platinum", name: "Vitalik", id: "xxx...e4f5", change: "0", up: null },
    { rank: "8", tier: "Gold", name: "Punk6529", id: "xxx...i8j9", change: "+1", up: true },
    { rank: "9", tier: "Gold", name: "DCFgod", id: "xxx...o4p5", change: "-1", up: false },
    { rank: "10", tier: "Classic", name: "GCR", id: "xxx...s8t9", change: "+5", up: true },
  ],
};

export const MY_RANKS: Record<LeaderboardCategoryKey, string> = {
  0: "56,247",
  1: "41,892",
  2: "63,104",
  3: "12,340",
  4: "38,771",
  5: "27,553",
};

export const TOTAL_USERS = "279,941";
