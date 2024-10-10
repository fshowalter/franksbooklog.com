import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const yearStatsJsonDirectory = getContentPath("data", "year-stats");

const Distribution = z.object({
  count: z.number(),
  name: z.string(),
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

const YearStatsJsonSchema = z.object({
  bookCount: z.number(),
  decadeDistribution: z.array(Distribution),
  editionDistribution: z.array(Distribution),
  kindDistribution: z.array(Distribution),
  mostReadAuthors: z.array(MostReadAuthorSchema),
  workCount: z.number(),
  year: z.string(),
});

export type YearStatsJson = z.infer<typeof YearStatsJsonSchema>;

async function parseAllYearStatsJson() {
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
}

export async function allYearStatsJson(): Promise<YearStatsJson[]> {
  return await parseAllYearStatsJson();
}
