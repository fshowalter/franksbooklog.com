import { perfLogger } from "./data/utils/performanceLogger";
import { allYearStatsJson, type YearStatsJson } from "./data/yearStatsJson";

export type YearStats = YearStatsJson & {};

const statYears = new Set<string>();

export async function allStatYears() {
  return await perfLogger.measure("allStatYears", async () => {
    if (statYears.size > 0) {
      return [...statYears].toSorted();
    }

    const yearStats = await allYearStatsJson();

    for (const stats of yearStats) {
      statYears.add(stats.year);
    }

    return [...statYears].toSorted();
  });
}

export async function statsForYear(year: string): Promise<YearStats> {
  return await perfLogger.measure("statsForYear", async () => {
    const yearStats = await allYearStatsJson();

    return yearStats.find((stats) => stats.year === year)!;
  });
}
