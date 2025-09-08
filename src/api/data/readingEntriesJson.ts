import { promises as fs } from "node:fs";
import { z } from "zod";

import { perfLogger } from "~/utils/performanceLogger";

import { getContentPath } from "./utils/getContentPath";
import { WorkKindSchema } from "./WorkKindSchema";

const readingEntriesJsonFile = getContentPath("data", "reading-entries.json");

const AuthorSchema = z.object({
  name: z.string(),
  slug: z.string(),
  sortName: z.string(),
});

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

export type ReadingEntryJson = z.infer<typeof ReadingEntryJsonSchema>;

export async function allReadingEntriesJson(): Promise<ReadingEntryJson[]> {
  return await perfLogger.measure("allReadingEntriesJson", async () => {
    return await parseAllReadingEntriesJson();
  });
}

async function parseAllReadingEntriesJson() {
  return await perfLogger.measure("parseAllReadingEntriesJson", async () => {
    const json = await fs.readFile(readingEntriesJsonFile, "utf8");
    const data = JSON.parse(json) as unknown[];

    return data.map((item) => {
      return ReadingEntryJsonSchema.parse(item);
    });
  });
}
