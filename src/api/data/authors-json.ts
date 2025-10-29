import { promises as fs } from "node:fs";
import { z } from "zod";

import { perfLogger } from "~/utils/performanceLogger";

import { getContentPath } from "./utils/getContentPath";
import { nullableString } from "./utils/nullable";
import { WorkKindSchema } from "./WorkKindSchema";

const authorsJsonDirectory = getContentPath("data", "authors");

/**
 * Zod schema for author information within a work's metadata.
 * Represents an individual author with their basic information.
 */
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

/**
 * Zod schema for work information within an author's reviewed works.
 * Contains comprehensive metadata about a book/work including review details.
 */
const WorkSchema = z.object({
  authors: z.array(WorkAuthorSchema),
  grade: z.string(),
  gradeValue: z.number(),
  includedInSlugs: z.array(z.string()),
  kind: WorkKindSchema,
  reviewDate: z.string(),
  reviewSequence: z.string(),
  reviewYear: z.string(),
  slug: z.string(),
  sortTitle: z.string(),
  subtitle: nullableString(),
  title: z.string(),
  workYear: z.string(),
});

/**
 * Zod schema for complete author data from JSON files.
 * Includes author metadata and all their reviewed works.
 */
const AuthorJsonSchema = z.object({
  name: z.string(),
  reviewedWorks: z.array(WorkSchema),
  slug: z.string(),
  sortName: z.string(),
});

/**
 * Author data structure from JSON files in the content directory
 */
export type AuthorJson = z.infer<typeof AuthorJsonSchema>;

// Cache at data layer - lazy caching for better build performance
let cachedAuthorsJson: AuthorJson[];

// Enable caching during builds but not in dev mode
const ENABLE_CACHE = !import.meta.env.DEV;

/**
 * Loads and validates all author JSON files from the content directory.
 * Authors are parsed with Zod schemas and cached during builds.
 *
 * @returns Promise resolving to array of validated author data
 */
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

/**
 * Internal function to parse all author JSON files from the file system.
 * Reads the authors directory and validates each JSON file against the schema.
 *
 * @returns Promise resolving to array of parsed and validated author data
 * @throws ZodError if any JSON file doesn't match the expected schema
 */
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
