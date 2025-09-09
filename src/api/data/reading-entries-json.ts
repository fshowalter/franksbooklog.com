import { promises as fs } from "node:fs";
import { z } from "zod";

import { perfLogger } from "~/utils/performanceLogger";

import { getContentPath } from "./utils/getContentPath";
import { WorkKindSchema } from "./WorkKindSchema";

const readingEntriesJsonFile = getContentPath("data", "reading-entries.json");

/**
 * Zod schema for author information within reading entries.
 * Basic author metadata for attribution purposes.
 */
const AuthorSchema = z.object({
  name: z.string(),
  slug: z.string(),
  sortName: z.string(),
});

/**
 * Zod schema for individual reading entry data from JSON.
 * Contains comprehensive information about a single reading session.
 */
const ReadingEntryJsonSchema = z.object({
  authors: z.array(AuthorSchema),
  edition: z.string(),
  includedInSlugs: z.array(z.string()),
  kind: WorkKindSchema,
  progress: z.string(),
  readingEntryDate: z.string(),
  readingEntrySequence: z.number(),
  reviewed: z.boolean(),
  slug: z.string(),
  title: z.string(),
  workYear: z.string(),
});

/**
 * Reading entry data structure from the reading entries JSON file
 */
export type ReadingEntryJson = z.infer<typeof ReadingEntryJsonSchema>;

/**
 * Loads and validates all reading entries from the reading-entries.json file.
 * Each entry represents a single reading session with progress tracking.
 *
 * @returns Promise resolving to array of validated reading entry data
 */
export async function allReadingEntriesJson(): Promise<ReadingEntryJson[]> {
  return await perfLogger.measure("allReadingEntriesJson", async () => {
    return await parseAllReadingEntriesJson();
  });
}

/**
 * Internal function to parse reading entries from the JSON file.
 * Reads the file and validates each entry against the schema.
 *
 * @returns Promise resolving to array of parsed and validated reading entries
 * @throws ZodError if any entry doesn't match the expected schema
 */
async function parseAllReadingEntriesJson() {
  return await perfLogger.measure("parseAllReadingEntriesJson", async () => {
    const json = await fs.readFile(readingEntriesJsonFile, "utf8");
    const data = JSON.parse(json) as unknown[];

    return data.map((item) => {
      return ReadingEntryJsonSchema.parse(item);
    });
  });
}
