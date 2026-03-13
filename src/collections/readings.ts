import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import path from "node:path";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkRehype from "remark-rehype";

import { CONTENT_ROOT } from "./contentRoot";
import { getBaseMarkdownProcessor } from "./utils/getBaseMarkdownProcessor";
import { loadMarkdownDirectory } from "./utils/loadMarkdownDirectory";
import { rootAsSpan } from "./utils/markdown-plugins/rootAsSpan";
import { markdownToHtml } from "./utils/markdownToHtml";

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
    workSlug: z.string(),
  })
  .transform(
    ({ date, edition, editionNotes, sequence, slug, timeline, workSlug }) => {
      // fix zod making anything with undefined optional
      return {
        date,
        edition,
        editionNotes,
        sequence,
        slug,
        timeline,
        workSlug,
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

/** Inline span HTML pipeline — wraps in <span>, no linkReviewedWorks */
function toInlineSpanHtml(content: string): string {
  return getBaseMarkdownProcessor()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rootAsSpan)
    .use(rehypeStringify)
    .processSync(content)
    .toString();
}

const ReadingSchema = z
  .object({
    body: z.string(),
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
    workId: z.string(),
  })
  .transform(
    ({
      body,
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
      workId,
    }) => {
      // fix zod making anything with undefined optional
      return {
        body,
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
        workId,
      };
    },
  );

export const readings = defineCollection({
  loader: {
    load: (loaderContext) =>
      loadMarkdownDirectory({
        buildData: ({ body, frontmatter }) => {
          const parsedFrontmatter = ReadingFrontmatterSchema.parse(frontmatter);

          const isAbandoned =
            parsedFrontmatter.timeline.at(-1)?.progress === "Abandoned";

          return {
            body,
            date: parsedFrontmatter.date,
            edition: parsedFrontmatter.edition,
            editionNotes: parsedFrontmatter.editionNotes,
            editionNotesHtml: parsedFrontmatter.editionNotes?.trim()
              ? toInlineSpanHtml(parsedFrontmatter.editionNotes)
              : undefined,
            isAbandoned: isAbandoned,
            readingNotesHtml: body.trim() ? markdownToHtml(body) : undefined,
            readingTime: computeReadingTime(parsedFrontmatter),
            sequence: parsedFrontmatter.sequence,
            slug: parsedFrontmatter.slug,
            timeline: parsedFrontmatter.timeline,
            workId: parsedFrontmatter.workSlug,
          };
        },
        directoryPath: path.join(CONTENT_ROOT, "readings"),
        loaderContext,
      }),
    name: "readings-loader",
  },
  schema: ReadingSchema,
});
