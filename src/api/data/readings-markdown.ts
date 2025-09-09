import matter from "gray-matter";
import { promises as fs } from "node:fs";
import { z } from "zod";

import { perfLogger } from "~/utils/performanceLogger";

import { getContentPath } from "./utils/getContentPath";
import { nullableString } from "./utils/nullable";

const readingsMarkdownDirectory = getContentPath("readings");

const TimelineEntrySchema = z.object({
  date: z.date(),
  progress: z.string(),
});

const DataSchema = z
  .object({
    edition: z.string(),
    edition_notes: nullableString(),
    sequence: z.number(),
    timeline: z.array(TimelineEntrySchema),
    work_slug: z.string(),
  })
  .transform(({ edition, edition_notes, sequence, timeline, work_slug }) => {
    // fix zod making anything with undefined optional
    return { edition, edition_notes, sequence, timeline, work_slug };
  });

export type MarkdownReading = {
  edition: string;
  editionNotesRaw: string | undefined;
  readingNotesRaw: string | undefined;
  sequence: number;
  slug: string;
  timeline: TimelineEntry[];
};

type TimelineEntry = z.infer<typeof TimelineEntrySchema>;

// Cache at data layer - lazy caching for better build performance
let cachedReadingsMarkdown: MarkdownReading[];

// Enable caching during builds but not in dev mode
const ENABLE_CACHE = !import.meta.env.DEV;

export async function allReadingsMarkdown(): Promise<MarkdownReading[]> {
  return await perfLogger.measure("allReadingsMarkdown", async () => {
    if (ENABLE_CACHE && cachedReadingsMarkdown) {
      return cachedReadingsMarkdown;
    }

    const readings = await parseAllReadingsMarkdown();

    if (ENABLE_CACHE) {
      cachedReadingsMarkdown = readings;
    }

    return readings;
  });
}

async function parseAllReadingsMarkdown() {
  return await perfLogger.measure("parseAllReadingsMarkdown", async () => {
    const dirents = await fs.readdir(readingsMarkdownDirectory, {
      withFileTypes: true,
    });

    return Promise.all(
      dirents
        .filter((item) => !item.isDirectory() && item.name.endsWith(".md"))
        .map(async (item) => {
          const fileContents = await fs.readFile(
            `${readingsMarkdownDirectory}/${item.name}`,
            "utf8",
          );

          const { content, data } = matter(fileContents);
          const greyMatter = DataSchema.parse(data);

          const markdownReading: MarkdownReading = {
            edition: greyMatter.edition,
            editionNotesRaw: greyMatter.edition_notes,
            readingNotesRaw: content,
            sequence: greyMatter.sequence,
            slug: greyMatter.work_slug,
            timeline: greyMatter.timeline,
          };

          return markdownReading;
        }),
    );
  });
}
