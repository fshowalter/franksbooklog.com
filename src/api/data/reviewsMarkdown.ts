import matter from "gray-matter";
import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";
import { perfLogger } from "./utils/performanceLogger";

const reviewsMarkdownDirectory = getContentPath("reviews");

export type MarkdownReview = {
  date: Date;
  grade: string;
  rawContent: string;
  slug: string;
  synopsis: string;
};

const DataSchema = z.object({
  date: z.date(),
  grade: z.string(),
  synopsis: z.optional(z.string()),
  work_slug: z.string(),
});

// Cache at data layer - lazy caching for better build performance
let cachedReviewsMarkdown: MarkdownReview[];

// Enable caching during builds but not in dev mode
const ENABLE_CACHE = !import.meta.env.DEV;

export async function allReviewsMarkdown(): Promise<MarkdownReview[]> {
  return await perfLogger.measure("allReviewsMarkdown", async () => {
    if (ENABLE_CACHE && cachedReviewsMarkdown) {
      return cachedReviewsMarkdown;
    }

    const reviews = await parseAllReviewsMarkdown();

    if (ENABLE_CACHE) {
      cachedReviewsMarkdown = reviews;
    }

    return reviews;
  });
}

async function parseAllReviewsMarkdown(): Promise<MarkdownReview[]> {
  return await perfLogger.measure("parseAllReviewsMarkdown", async () => {
    const dirents = await fs.readdir(reviewsMarkdownDirectory, {
      withFileTypes: true,
    });

    return Promise.all(
      dirents
        .filter((item) => !item.isDirectory() && item.name.endsWith(".md"))
        .map(async (item) => {
          const fileContents = await fs.readFile(
            `${reviewsMarkdownDirectory}/${item.name}`,
            "utf8",
          );

          const { content, data } = matter(fileContents);
          const greyMatter = DataSchema.parse(data);

          return {
            date: greyMatter.date,
            grade: greyMatter.grade,
            rawContent: content,
            slug: greyMatter.work_slug,
            synopsis: greyMatter.synopsis || "",
          };
        }),
    );
  });
}
