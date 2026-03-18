import { BENEFIT_CATEGORIES, PARTNERS_DATA } from "@/features/launch-app/campaign-data";
import type { Partner } from "@/features/launch-app/types";
import { LEADERBOARD_CATEGORIES, LEADERBOARDS, MY_RANKS, TOTAL_USERS } from "@/features/standing/standing-data";
import { ANALYSIS_HISTORY, getLookUpMock } from "@/features/x-ray/look-up-data";

export const launchMockRepository = {
  getBenefitCategories(): readonly string[] {
    return BENEFIT_CATEGORIES;
  },

  getPartners(): readonly Partner[] {
    return PARTNERS_DATA;
  },

  getLeaderboardCategories(): readonly string[] {
    return LEADERBOARD_CATEGORIES;
  },

  getLeaderboards() {
    return LEADERBOARDS;
  },

  getMyRanks() {
    return MY_RANKS;
  },

  getTotalUsers() {
    return TOTAL_USERS;
  },

  getAnalysisHistory() {
    return ANALYSIS_HISTORY;
  },

  getAnalysisResult(wallet: string) {
    return getLookUpMock(wallet);
  },
};
