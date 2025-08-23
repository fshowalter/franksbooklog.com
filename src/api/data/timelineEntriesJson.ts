import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";
import { nullableString } from "./utils/nullable";
import { perfLogger } from "./utils/performanceLogger";
import { WorkKindSchema } from "./WorkKindSchema";

const timelineEntriesJsonFile = getContentPath("data", "timeline-entries.json");

const AuthorSchema = z.object({
  authorId: z.string(),
  name: z.string(),
  slug: nullableString(),
  sortName: z.string(),
});

const TimelineEntryJsonSchema = z.object({
  authors: z.array(AuthorSchema),
  edition: z.string(),
  includedInWorkIds: z.array(z.string()),
  kind: WorkKindSchema,
  progress: z.string(),
  slug: nullableString(),
  timelineDate: z.string(),
  timelineSequence: z.number(),
  title: z.string(),
  workId: z.string(),
  workYear: z.string(),
});

export type TimelineEntryJson = z.infer<typeof TimelineEntryJsonSchema>;

export async function allTimelineEntriesJson(): Promise<TimelineEntryJson[]> {
  return await perfLogger.measure("allTimelineEntriesJson", async () => {
    return await parseAllTimelineEntriesJson();
  });
}

async function parseAllTimelineEntriesJson() {
  return await perfLogger.measure("parseAllTimelineEntriesJson", async () => {
    const json = await fs.readFile(timelineEntriesJsonFile, "utf8");
    const data = JSON.parse(json) as unknown[];

    return data.map((item) => {
      return TimelineEntryJsonSchema.parse(item);
    });
  });
}
