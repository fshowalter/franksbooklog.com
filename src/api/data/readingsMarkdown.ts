import matter from "gray-matter";
import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const readingsMarkdownDirectory = getContentPath("readings");

const TimelineEntrySchema = z.object({
  date: z.date(),
  progress: z.string(),
});

const DataSchema = z.object({
  edition: z.string(),
  edition_notes: z.nullable(z.string()),
  sequence: z.number(),
  timeline: z.array(TimelineEntrySchema),
  work_slug: z.string(),
});

type TimelineEntry = z.infer<typeof TimelineEntrySchema>;

export type MarkdownReading = {
  edition: string;
  editionNotesRaw: null | string;
  readingNotesRaw: null | string;
  sequence: number;
  slug: string;
  timeline: TimelineEntry[];
};

async function parseAllReadingsMarkdown() {
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
}

export async function allReadingsMarkdown(): Promise<MarkdownReading[]> {
  return await parseAllReadingsMarkdown();
}
