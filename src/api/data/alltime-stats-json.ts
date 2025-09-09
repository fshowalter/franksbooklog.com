import { promises as fs } from "node:fs";
import { z } from "zod";

import { perfLogger } from "~/utils/performanceLogger";

import { DistributionSchema } from "./DistributionSchema";
import { MostReadAuthorSchema } from "./MostReadAuthorSchema";
import { getContentPath } from "./utils/getContentPath";

const alltimeStatsFile = getContentPath("data", "all-time-stats.json");

/**
 * Extended distribution schema for grade data that includes a sort value.
 * Used specifically for organizing review grades in proper order.
 */
const GradeDistributionSchema = DistributionSchema.extend({
  sortValue: z.number(),
});

/**
 * Zod schema for all-time statistics data loaded from JSON.
 * Validates the structure of comprehensive reading statistics across all years.
 */
const AlltimeStatsJsonSchema = z.object({
  bookCount: z.number(),
  decadeDistribution: z.array(DistributionSchema),
  editionDistribution: z.array(DistributionSchema),
  gradeDistribution: z.array(GradeDistributionSchema),
  kindDistribution: z.array(DistributionSchema),
  mostReadAuthors: z.array(MostReadAuthorSchema),
  reviewCount: z.number(),
  workCount: z.number(),
});

/**
 * Type representing all-time reading statistics data.
 * Contains comprehensive metrics including counts, distributions, and top authors.
 */
export type AlltimeStatsJson = z.infer<typeof AlltimeStatsJsonSchema>;

/**
 * Loads and validates all-time reading statistics from JSON file.
 * Provides comprehensive lifetime reading metrics including book counts,
 * grade distributions, most read authors, and categorical breakdowns.
 *
 * @returns Promise resolving to validated all-time statistics data
 * @throws ZodError if the JSON data doesn't match the expected schema
 *
 * @example
 * ```typescript
 * const stats = await alltimeStatsJson();
 * console.log(`Total books read: ${stats.bookCount}`);
 * console.log(`Top author: ${stats.mostReadAuthors[0].name}`);
 * ```
 */
export async function alltimeStatsJson(): Promise<AlltimeStatsJson> {
  return await perfLogger.measure("alltimeStatsJson", async () => {
    const json = await fs.readFile(alltimeStatsFile, "utf8");
    const data = JSON.parse(json) as unknown[];

    return AlltimeStatsJsonSchema.parse(data);
  });
}
