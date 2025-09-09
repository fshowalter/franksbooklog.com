import { ENABLE_CACHE } from "~/utils/cache";
import { perfLogger } from "~/utils/performanceLogger";

import type { AlltimeStatsJson } from "./data/alltime-stats-json";
import type { YearStatsJson } from "./data/year-stats-json";

import { alltimeStatsJson } from "./data/alltime-stats-json";
import { allYearStatsJson } from "./data/year-stats-json";

/**
 * All-time reading statistics data type
 */
export type AlltimeStats = AlltimeStatsJson & {};

/**
 * Year-specific reading statistics data type
 */
export type YearStats = YearStatsJson & {};

let cachedYearStatsJson: YearStatsJson[];

const statYears = new Set<string>();

/**
 * Retrieves all years for which reading statistics are available.
 * Results are cached after first load for performance.
 * 
 * @returns Promise resolving to sorted array of year strings
 */
export async function allStatYears() {
  return await perfLogger.measure("allStatYears", async () => {
    if (statYears.size > 0) {
      return [...statYears].toSorted();
    }

    const yearStats = cachedYearStatsJson || (await allYearStatsJson());
    if (ENABLE_CACHE && !cachedYearStatsJson) {
      cachedYearStatsJson = yearStats;
    }

    for (const stats of yearStats) {
      statYears.add(stats.year);
    }

    return [...statYears].toSorted();
  });
}

/**
 * Retrieves all-time reading statistics including distributions and totals.
 * 
 * @returns Promise resolving to all-time statistics data
 */
export async function alltimeStats(): Promise<AlltimeStats> {
  return await perfLogger.measure("alltimeStats", async () => {
    return await alltimeStatsJson();
  });
}

/**
 * Retrieves reading statistics for a specific year.
 * Results are cached in production for performance.
 * 
 * @param year - The year to get statistics for (e.g., "2024")
 * @returns Promise resolving to year-specific statistics data
 */
export async function statsForYear(year: string): Promise<YearStats> {
  return await perfLogger.measure("statsForYear", async () => {
    const yearStats = cachedYearStatsJson || (await allYearStatsJson());
    if (ENABLE_CACHE && !cachedYearStatsJson) {
      cachedYearStatsJson = yearStats;
    }

    return yearStats.find((stats) => stats.year === year)!;
  });
}
