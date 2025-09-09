import { promises as fs } from "node:fs";
import { z } from "zod";

import { perfLogger } from "~/utils/performanceLogger";

import { DistributionSchema } from "./DistributionSchema";
import { MostReadAuthorSchema } from "./MostReadAuthorSchema";
import { getContentPath } from "./utils/getContentPath";

const yearStatsJsonDirectory = getContentPath("data", "year-stats");

/**
 * Zod schema for yearly reading statistics data.
 * Contains comprehensive metrics for a single year's reading activity.
 */
const YearStatsJsonSchema = z.object({
  bookCount: z.number(),
  decadeDistribution: z.array(DistributionSchema),
  editionDistribution: z.array(DistributionSchema),
  kindDistribution: z.array(DistributionSchema),
  mostReadAuthors: z.array(MostReadAuthorSchema),
  workCount: z.number(),
  year: z.string(),
});

/**
 * Type representing yearly reading statistics data.
 * Contains metrics and distributions for a specific year.
 */
export type YearStatsJson = z.infer<typeof YearStatsJsonSchema>;

/**
 * Loads and validates all yearly statistics from JSON files.
 * Each file contains comprehensive reading metrics for one year.
 *
 * @returns Promise resolving to array of validated yearly statistics
 * @throws ZodError if any JSON file doesn't match the expected schema
 *
 * @example
 * ```typescript
 * const yearStats = await allYearStatsJson();
 * const currentYear = yearStats.find(stats => stats.year === '2024');
 * console.log(`Books read in 2024: ${currentYear?.bookCount}`);
 * ```
 */
export async function allYearStatsJson(): Promise<YearStatsJson[]> {
  return await perfLogger.measure("allYearStatsJson", async () => {
    return await parseAllYearStatsJson();
  });
}

/**
 * Internal function to parse all yearly statistics JSON files.
 * Reads the year-stats directory and validates each JSON file.
 *
 * @returns Promise resolving to array of parsed and validated yearly statistics
 * @throws ZodError if any file doesn't match the expected schema
 */
async function parseAllYearStatsJson() {
  return await perfLogger.measure("parseAllYearStatsJson", async () => {
    const dirents = await fs.readdir(yearStatsJsonDirectory, {
      withFileTypes: true,
    });

    return Promise.all(
      dirents
        .filter((item) => !item.isDirectory() && item.name.endsWith(".json"))
        .map(async (item) => {
          const fileContents = await fs.readFile(
            `${yearStatsJsonDirectory}/${item.name}`,
            "utf8",
          );

          const json = JSON.parse(fileContents) as unknown;
          return YearStatsJsonSchema.parse(json);
        }),
    );
  });
}
