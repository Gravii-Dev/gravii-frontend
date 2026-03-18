import { launchMockRepository } from "@/features/launch-app/mock-repository";

export const XRAY_PRICE_LABEL = "0.1 USDC";

export const XRAY_SEARCH_STATS = [
  { label: "COST", value: XRAY_PRICE_LABEL },
  { label: "IN-DEPTH", value: "MULTI-CHAIN" },
  { label: "SPEED", value: "< 30 SEC" },
] as const;

export function getAnalysisHistoryPage(page: number, perPage = 5) {
  const rows = launchMockRepository.getAnalysisHistory();
  const totalPages = Math.ceil(rows.length / perPage);
  const currentPage = Math.min(Math.max(page, 0), Math.max(totalPages - 1, 0));

  return {
    currentPage,
    totalPages,
    rows: rows.slice(currentPage * perPage, (currentPage + 1) * perPage),
    totalCount: rows.length,
  };
}

export function getAnalysisResult(wallet: string) {
  return launchMockRepository.getAnalysisResult(wallet);
}
