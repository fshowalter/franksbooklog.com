import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadJsonDirectory } from "./utils/loadJsonDirectory";
import { loadSingleJsonFile } from "./utils/loadSingleJsonFile";

const MostReadAuthorTitleSchema = z
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
    authorSlug: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    count: z.number(),
    name: z.string(),
    readTitles: z.array(MostReadAuthorTitleSchema),
  })
  .transform(({ authorSlug, count, name, readTitles }) => {
    // fix zod making anything with undefined optional
    return { authorSlug, count, name, readTitles };
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
  titleCount: z.number(),
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
  titleCount: z.number(),
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
