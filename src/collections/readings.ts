import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { renderHtml, renderInlineHtml } from "markdown-utils";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadMarkdownDirectory } from "./utils/loadMarkdownDirectory";

const TimelineEntrySchema = z.object({
  date: z.coerce.date(),
  progress: z.string(),
});

const ReadingFrontmatterSchema = z
  .object({
    date: z.coerce.date(),
    edition: z.string(),
    editionNotes: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    sequence: z.number(),
    slug: z.string(),
    timeline: z.array(TimelineEntrySchema),
    titleId: z.string(),
  })
  .transform(
    ({ date, edition, editionNotes, sequence, slug, timeline, titleId }) => {
      // fix zod making anything with undefined optional
      return {
        date,
        edition,
        editionNotes,
        sequence,
        slug,
        timeline,
        titleId,
      };
    },
  );

type ReadingFrontmatter = z.infer<typeof ReadingFrontmatterSchema>;

function computeReadingTime(readingFrontmatter: ReadingFrontmatter): number {
  if (readingFrontmatter.timeline.length === 0) return 1;

  const timeline = readingFrontmatter.timeline.toSorted(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  const start = timeline[0].date;
  const end = readingFrontmatter.date;
  return (
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );
}

const ReadingSchema = z
  .object({
    date: z.coerce.date(),
    edition: z.string(),
    editionNotes: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    editionNotesHtml: z.string().optional(),
    isAbandoned: z.boolean(),
    readingNotesHtml: z.string().optional(),
    readingTime: z.number(),
    sequence: z.number(),
    slug: z.string(),
    timeline: z.array(TimelineEntrySchema),
    titleId: z.string(),
  })
  .transform(
    ({
      date,
      edition,
      editionNotes,
      editionNotesHtml,
      isAbandoned,
      readingNotesHtml,
      readingTime,
      sequence,
      slug,
      timeline,
      titleId,
    }) => {
      // fix zod making anything with undefined optional
      return {
        date,
        edition,
        editionNotes,
        editionNotesHtml,
        isAbandoned,
        readingNotesHtml,
        readingTime,
        sequence,
        slug,
        timeline,
        titleId,
      };
    },
  );

export const readings = defineCollection({
  loader: {
    load: (loaderContext) =>
      loadMarkdownDirectory({
        buildData: ({ frontmatter, source }) => {
          const parsedFrontmatter = ReadingFrontmatterSchema.parse(frontmatter);

          const isAbandoned =
            parsedFrontmatter.timeline.at(-1)?.progress === "Abandoned";

          return {
            date: parsedFrontmatter.date,
            edition: parsedFrontmatter.edition,
            editionNotes: parsedFrontmatter.editionNotes,
            editionNotesHtml: parsedFrontmatter.editionNotes?.trim()
              ? renderInlineHtml(parsedFrontmatter.editionNotes)
              : undefined,
            isAbandoned: isAbandoned,
            // Most readings are frontmatter only; an empty render means no notes.
            readingNotesHtml: renderHtml(source) || undefined,
            readingTime: computeReadingTime(parsedFrontmatter),
            sequence: parsedFrontmatter.sequence,
            slug: parsedFrontmatter.slug,
            timeline: parsedFrontmatter.timeline,
            titleId: parsedFrontmatter.titleId,
          };
        },
        directoryPath: path.join(CONTENT_ROOT, "readings"),
        loaderContext,
      }),
    name: "readings-loader",
  },
  schema: ReadingSchema,
});
