import matter from "gray-matter";
import { promises as fs } from "node:fs";
import { z } from "zod";

import { perfLogger } from "~/utils/performanceLogger";

import { getContentPath } from "./utils/getContentPath";

const pagesMarkdownDirectory = getContentPath("pages");

/**
 * Type representing a parsed Markdown page from the content directory.
 * Contains the raw content and frontmatter metadata.
 */
export type MarkdownPage = {
  rawContent: string;
  slug: string;
  title: string;
};

/**
 * Zod schema for validating frontmatter data in Markdown page files.
 * Ensures each page has required metadata fields.
 */
const DataSchema = z.object({
  slug: z.string(),
  title: z.string(),
});

// Cache at data layer - lazy caching for better build performance
let cachedPagesMarkdown: MarkdownPage[];

// Enable caching during builds but not in dev mode
const ENABLE_CACHE = !import.meta.env.DEV;

/**
 * Loads and parses all Markdown page files from the content directory.
 * Pages are parsed with gray-matter and cached during builds for performance.
 *
 * @returns Promise resolving to array of parsed Markdown pages
 * @throws ZodError if any page's frontmatter doesn't match the expected schema
 *
 * @example
 * ```typescript
 * const pages = await allPagesMarkdown();
 * const aboutPage = pages.find(page => page.slug === 'about');
 * console.log(aboutPage.title); // Page title from frontmatter
 * ```
 */
export async function allPagesMarkdown(): Promise<MarkdownPage[]> {
  return await perfLogger.measure("allPagesMarkdown", async () => {
    if (ENABLE_CACHE && cachedPagesMarkdown) {
      return cachedPagesMarkdown;
    }

    const pages = await parseAllPagesMarkdown();

    if (ENABLE_CACHE) {
      cachedPagesMarkdown = pages;
    }

    return pages;
  });
}

/**
 * Internal function to parse all Markdown page files from the file system.
 * Reads the pages directory and processes each .md file with gray-matter.
 *
 * @returns Promise resolving to array of parsed and validated page data
 * @throws ZodError if any page's frontmatter doesn't match the expected schema
 */
async function parseAllPagesMarkdown() {
  return await perfLogger.measure("parseAllPagesMarkdown", async () => {
    const dirents = await fs.readdir(pagesMarkdownDirectory, {
      withFileTypes: true,
    });

    return Promise.all(
      dirents
        .filter((item) => !item.isDirectory() && item.name.endsWith(".md"))
        .map(async (item) => {
          const fileContents = await fs.readFile(
            `${pagesMarkdownDirectory}/${item.name}`,
            "utf8",
          );

          const { content, data } = matter(fileContents);
          const greyMatter = DataSchema.parse(data);

          const markdownPage: MarkdownPage = {
            rawContent: content,
            slug: greyMatter.slug,
            title: greyMatter.title,
          };

          return markdownPage;
        }),
    );
  });
}
