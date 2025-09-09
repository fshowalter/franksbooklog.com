import matter from "gray-matter";
import { promises as fs } from "node:fs";
import { z } from "zod";

import { perfLogger } from "~/utils/performanceLogger";

import { getContentPath } from "./utils/getContentPath";

const reviewsMarkdownDirectory = getContentPath("reviews");

/**
 * Markdown review data structure parsed from review files
 */
export type MarkdownReview = {
  date: Date;
  grade: string;
  rawContent: string;
  slug: string;
  synopsis: string;
};

/**
 * Zod schema for validating review markdown frontmatter
 */
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

/**
 * Loads and parses all review markdown files from the reviews directory.
 * Extracts frontmatter data and content, validates with Zod schema.
 * Results are cached during builds for performance.
 *
 * @returns Promise resolving to array of parsed review data
 */
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

/**
 * Internal function to parse all review Markdown files from the file system.
 * Processes each .md file with gray-matter and validates the frontmatter.
 *
 * @returns Promise resolving to array of parsed and validated review data
 * @throws ZodError if any review's frontmatter doesn't match the expected schema
 */
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
