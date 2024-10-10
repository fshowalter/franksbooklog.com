import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";
import { WorkKindSchema } from "./utils/workKindSchema";

const reviewedWorksJsonFile = getContentPath("data", "reviewed-works.json");

const ReadingSchema = z.object({
  abandoned: z.boolean(),
  date: z.coerce.date(),
  isAudiobook: z.boolean(),
  readingTime: z.number(),
  sequence: z.number(),
});

const AuthorSchema = z.object({
  name: z.string(),
  notes: z.nullable(z.string()),
  slug: z.string(),
  sortName: z.string(),
});

const IncludedWorkAuthorSchema = z.object({
  name: z.string(),
  slug: z.string(),
});

const IncludedWorkSchema = z.object({
  authors: z.array(IncludedWorkAuthorSchema),
  grade: z.string(),
  kind: WorkKindSchema,
  slug: z.string(),
  title: z.string(),
  yearPublished: z.string(),
});

const MoreReviewAuthorSchema = z.object({
  name: z.string(),
});

const MoreReviewSchema = z.object({
  authors: z.array(MoreReviewAuthorSchema),
  grade: z.string(),
  includedInSlugs: z.array(z.string()),
  kind: WorkKindSchema,
  slug: z.string(),
  title: z.string(),
  yearPublished: z.string(),
});

const MoreByAuthorSchema = z.object({
  name: z.string(),
  slug: z.string(),
  works: z.array(MoreReviewSchema),
});

const ReviewedWorkJsonSchema = z.object({
  authors: z.array(AuthorSchema),
  gradeValue: z.number(),
  includedInSlugs: z.array(z.string()),
  includedWorks: z.array(IncludedWorkSchema),
  kind: WorkKindSchema,
  moreByAuthors: z.array(MoreByAuthorSchema),
  moreReviews: z.array(MoreReviewSchema),
  readings: z.array(ReadingSchema),
  sequence: z.number(),
  slug: z.string(),
  sortTitle: z.string(),
  subtitle: z.nullable(z.string()),
  title: z.string(),
  yearPublished: z.string(),
});

export type ReviewedWorkJsonReading = z.infer<typeof ReadingSchema>;

export type ReviewedWorkJson = z.infer<typeof ReviewedWorkJsonSchema>;

async function parseAllReviewedWorksJson() {
  const json = await fs.readFile(reviewedWorksJsonFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return data.map((item) => {
    return ReviewedWorkJsonSchema.parse(item);
  });
}

export async function allReviewedWorksJson(): Promise<ReviewedWorkJson[]> {
  return await parseAllReviewedWorksJson();
}
