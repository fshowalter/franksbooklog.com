import type { CollectionEntry } from "astro:content";

import { getCollection } from "astro:content";

export async function getAlltimeStats(): Promise<[CollectionEntry<"alltimeStats">["data"], string[]]>  {
  const allTimeStatsEntries = await getCollection("alltimeStats");

    if (allTimeStatsEntries.length !== 1) {
        throw new Error(`Expected exactly 1 entry in alltimeStats but got ${allTimeStatsEntries.length}`)
    }

    const allTimeStats = allTimeStatsEntries[0].data;
    const distinctStatsYears = await getDistinctStatsYears();

    return [allTimeStats, distinctStatsYears]
}

export async function getDistinctStatsYears(): Promise<string[]> {
  const statYearEntries = await getCollection("yearStats");

  return statYearEntries.map((stats) => stats.data.year).toSorted();
}
