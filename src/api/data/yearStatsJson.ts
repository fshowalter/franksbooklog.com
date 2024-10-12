import { promises as fs } from "node:fs";
import { z } from "zod";

import { DistributionSchema } from "./DistributionSchema";
import { MostReadAuthorSchema } from "./MostReadAuthorSchema";
import { getContentPath } from "./utils/getContentPath";

const yearStatsJsonDirectory = getContentPath("data", "year-stats");

const YearStatsJsonSchema = z.object({
  bookCount: z.number(),
  decadeDistribution: z.array(DistributionSchema),
  editionDistribution: z.array(DistributionSchema),
  kindDistribution: z.array(DistributionSchema),
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
