import { ENABLE_CACHE } from "~/utils/cache";
import { perfLogger } from "~/utils/performanceLogger";

import { allYearStatsJson, type YearStatsJson } from "./data/yearStatsJson";

export type YearStats = YearStatsJson & {};

let cachedYearStatsJson: YearStatsJson[];

const statYears = new Set<string>();

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

export async function statsForYear(year: string): Promise<YearStats> {
  return await perfLogger.measure("statsForYear", async () => {
    const yearStats = cachedYearStatsJson || (await allYearStatsJson());
    if (ENABLE_CACHE && !cachedYearStatsJson) {
      cachedYearStatsJson = yearStats;
    }

    return yearStats.find((stats) => stats.year === year)!;
  });
}
