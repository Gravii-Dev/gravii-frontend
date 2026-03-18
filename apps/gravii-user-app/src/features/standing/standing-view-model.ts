import { launchMockRepository } from "@/features/launch-app/mock-repository";
import type { LeaderboardCategoryKey } from "@/features/launch-app/types";

function parseNumericString(value: string) {
  return Number.parseInt(value.replace(/,/g, ""), 10);
}

export function getStandingPercentile(rank: string, totalUsers: string) {
  const rankValue = parseNumericString(rank);
  const totalValue = parseNumericString(totalUsers);

  return Math.round((rankValue / totalValue) * 100);
}

export function getStandingSnapshot(activeCategory: LeaderboardCategoryKey) {
  const categories = launchMockRepository.getLeaderboardCategories();
  const leaderboards = launchMockRepository.getLeaderboards();
  const myRanks = launchMockRepository.getMyRanks();
  const totalUsers = launchMockRepository.getTotalUsers();

  return {
    categories,
    rows: leaderboards[activeCategory] ?? leaderboards[0],
    myRank: myRanks[activeCategory],
    totalUsers,
  };
}
