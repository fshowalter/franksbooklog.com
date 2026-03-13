import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadJsonDirectory } from "./utils/loadJsonDirectory";
import { loadSingleJsonFile } from "./utils/loadSingleJsonFile";

const MostReadAuthorWorkSchema = z
  .object({
    edition: z.string(),
    readingDate: z.coerce.date(),
    reviewSlug: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    title: z.string(),
  })
  .transform(({ edition, readingDate, reviewSlug, title }) => {
    // fix zod making anything with undefined optional
    return { edition, readingDate, reviewSlug, title };
  });

const MostReadAuthorSchema = z
  .object({
    count: z.number(),
    name: z.string(),
    readWorks: z.array(MostReadAuthorWorkSchema),
    reviewed: z.boolean(),
    slug: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
  })
  .transform(({ count, name, readWorks, reviewed, slug }) => {
    // fix zod making anything with undefined optional
    return { count, name, readWorks, reviewed, slug };
  });

export type MostReadAuthor = z.infer<typeof MostReadAuthorSchema>;

const DistributionSchema = z.object({
  count: z.number(),
  name: z.string(),
});

const GradeDistributionSchema = DistributionSchema.extend({
  sortValue: z.number(),
});

const YearStatsSchema = z.object({
  bookCount: z.number(),
  decadeDistribution: z.array(DistributionSchema),
  editionDistribution: z.array(DistributionSchema),
  kindDistribution: z.array(DistributionSchema),
  mostReadAuthors: z.array(MostReadAuthorSchema),
  workCount: z.number(),
  year: z.string(),
});

const AlltimeStatsSchema = z.object({
  bookCount: z.number(),
  decadeDistribution: z.array(DistributionSchema),
  editionDistribution: z.array(DistributionSchema),
  gradeDistribution: z.array(GradeDistributionSchema),
  kindDistribution: z.array(DistributionSchema),
  mostReadAuthors: z.array(MostReadAuthorSchema),
  reviewCount: z.number(),
  statsYears: z.array(z.string()),
  workCount: z.number(),
});

export const yearStats = defineCollection({
  loader: {
    load: (ctx) =>
      loadJsonDirectory({
        directoryPath: path.join(CONTENT_ROOT, "data", "year-stats"),
        getId: (raw) => raw.year as string,
        loaderContext: ctx,
      }),
    name: "year-stats-loader",
  },
  schema: YearStatsSchema,
});

export const alltimeStats = defineCollection({
  loader: {
    load: (loaderContext) =>
      loadSingleJsonFile({
        filePath: path.join(CONTENT_ROOT, "data", "all-time-stats.json"),
        id: "alltimeStats",
        loaderContext,
      }),
    name: "alltime-stats-loader",
  },
  schema: AlltimeStatsSchema,
});
