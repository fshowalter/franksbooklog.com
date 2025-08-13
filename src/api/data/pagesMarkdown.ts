import matter from "gray-matter";
import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";
import { perfLogger } from "./utils/performanceLogger";

const pagesMarkdownDirectory = getContentPath("pages");

export type MarkdownPage = {
  rawContent: string;
  slug: string;
  title: string;
};

const DataSchema = z.object({
  slug: z.string(),
  title: z.string(),
});

// Cache at data layer - lazy caching for better build performance
let cachedPagesMarkdown: MarkdownPage[];

// Enable caching during builds but not in dev mode
const ENABLE_CACHE = !import.meta.env.DEV;

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
