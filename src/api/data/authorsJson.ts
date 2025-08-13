import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";
import { nullableString } from "./utils/nullable";
import { perfLogger } from "./utils/performanceLogger";
import { WorkKindSchema } from "./WorkKindSchema";

const authorsJsonDirectory = getContentPath("data", "authors");

const WorkAuthorSchema = z
  .object({
    name: z.string(),
    notes: nullableString(),
    slug: z.string(),
    sortName: z.string(),
  })
  .transform(({ name, notes, slug, sortName }) => {
    // fix zod making anything with undefined optional
    return { name, notes, slug, sortName };
  });

const WorkSchema = z.object({
  authors: z.array(WorkAuthorSchema),
  grade: z.string(),
  gradeValue: z.number(),
  includedInSlugs: z.array(z.string()),
  kind: WorkKindSchema,
  reviewDate: z.string(),
  reviewSequence: z.string(),
  slug: z.string(),
  sortTitle: z.string(),
  subtitle: nullableString(),
  title: z.string(),
  yearPublished: z.string(),
  yearReviewed: z.number(),
});

const AuthorJsonSchema = z.object({
  name: z.string(),
  reviewedWorks: z.array(WorkSchema),
  slug: z.string(),
  sortName: z.string(),
});

export type AuthorJson = z.infer<typeof AuthorJsonSchema>;

// Cache at data layer - lazy caching for better build performance
let cachedAuthorsJson: AuthorJson[];

// Enable caching during builds but not in dev mode
const ENABLE_CACHE = !import.meta.env.DEV;

export async function allAuthorsJson(): Promise<AuthorJson[]> {
  return await perfLogger.measure("allAuthorsJson", async () => {
    if (ENABLE_CACHE && cachedAuthorsJson) {
      return cachedAuthorsJson;
    }

    const authors = await parseAllAuthorsJson();

    if (ENABLE_CACHE) {
      cachedAuthorsJson = authors;
    }

    return authors;
  });
}

async function parseAllAuthorsJson() {
  return await perfLogger.measure("parseAllAuthorsJson", async () => {
    const dirents = await fs.readdir(authorsJsonDirectory, {
      withFileTypes: true,
    });

    return Promise.all(
      dirents
        .filter((entry) => !entry.isDirectory() && entry.name.endsWith(".json"))
        .map(async (entry) => {
          const fileContents = await fs.readFile(
            `${authorsJsonDirectory}/${entry.name}`,
            "utf8",
          );

          const json = JSON.parse(fileContents) as unknown;
          return AuthorJsonSchema.parse(json);
        }),
    );
  });
}
