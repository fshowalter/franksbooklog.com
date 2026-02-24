import type { AlltimeStatData, YearStatData } from "~/content.config";

export type AlltimeStats = AlltimeStatData & {};

export type YearStats = YearStatData & {};

export function allStatYears(yearStats: YearStatData[]): string[] {
  return yearStats.map((stats) => stats.year).toSorted();
}

export function alltimeStats(data: AlltimeStatData): AlltimeStats {
  return data;
}

export function statsForYear(
  year: string,
  yearStats: YearStatData[],
): undefined | YearStats {
  return yearStats.find((stats) => stats.year === year);
}
