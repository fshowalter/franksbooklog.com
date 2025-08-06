import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";
import { WorkKindSchema } from "./WorkKindSchema";

const timelineEntriesJsonFile = getContentPath("data", "timeline-entries.json");

const AuthorSchema = z.object({
  name: z.string(),
  slug: z.string(),
  sortName: z.string(),
});

const TimelineEntryJsonSchema = z.object({
  authors: z.array(AuthorSchema),
  edition: z.string(),
  includedInSlugs: z.array(z.string()),
  kind: WorkKindSchema,
  progress: z.string(),
  reviewed: z.boolean(),
  slug: z.string(),
  timelineDate: z.string(),
  timelineSequence: z.string(),
  title: z.string(),
  yearPublished: z.string(),
});

export type TimelineEntryJson = z.infer<typeof TimelineEntryJsonSchema>;

export async function allTimelineEntriesJson(): Promise<TimelineEntryJson[]> {
  return await parseAllTimelineEntriesJson();
}

async function parseAllTimelineEntriesJson() {
  const json = await fs.readFile(timelineEntriesJsonFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return data.map((item) => {
    return TimelineEntryJsonSchema.parse(item);
  });
}
