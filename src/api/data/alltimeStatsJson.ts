import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const alltimeStatsFile = getContentPath("data", "all-time-stats.json");

const Distribution = z.object({
  count: z.number(),
  name: z.string(),
});

const GradeDistribution = Distribution.extend({
  sortValue: z.number(),
});

const MostReadAuthorReading = z.object({
  date: z.string(),
  edition: z.string(),
  includedInSlugs: z.array(z.string()),
  kind: z.string(),
  reviewed: z.boolean(),
  sequence: z.number(),
  slug: z.string(),
  title: z.string(),
  yearPublished: z.string(),
});

const MostReadAuthorSchema = z.object({
  count: z.number(),
  name: z.string(),
  readings: z.array(MostReadAuthorReading),
  slug: z.nullable(z.string()),
});

const AlltimeStatsJsonSchema = z.object({
  bookCount: z.number(),
  decadeDistribution: z.array(Distribution),
  editionDistribution: z.array(Distribution),
  gradeDistribution: z.array(GradeDistribution),
  kindDistribution: z.array(Distribution),
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
