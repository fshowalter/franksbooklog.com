import { promises as fs } from "node:fs";
import { z } from "zod";

import { DistributionSchema } from "./DistributionSchema";
import { MostReadAuthorSchema } from "./MostReadAuthorSchema";
import { getContentPath } from "./utils/getContentPath";

const alltimeStatsFile = getContentPath("data", "all-time-stats.json");

const GradeDistributionSchema = DistributionSchema.extend({
  sortValue: z.number(),
});

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

export type AlltimeStatsJson = z.infer<typeof AlltimeStatsJsonSchema>;

export async function alltimeStatsJson(): Promise<AlltimeStatsJson> {
  const json = await fs.readFile(alltimeStatsFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return AlltimeStatsJsonSchema.parse(data);
}
