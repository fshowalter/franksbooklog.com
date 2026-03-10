//
// Key gotchas:
// - Always call ctx.parseData() before store.set() — Zod transforms (z.coerce.date())
//   only run if parseData is called
// - Call ctx.parseData and ctx.generateDigest via ctx. (not destructured) to avoid
//   @typescript-eslint/unbound-method lint errors
// - reference() fields accept plain slug strings from the source JSON — parseData()
//   coerces them to { collection, id } objects automatically
// - linkReviewedWorks is NOT applied in loaders — loaders store intermediate HTML
//   with <span data-work-slug=""> spans intact; linking happens at build time in API layer
// - Object literal keys must be alphabetically sorted (perfectionist/sort-objects rule)
// - If loader data seems stale after a remark pipeline change, delete
//   .astro/data-store.json to force a rebuild (raw-content digests don't capture
//   pipeline changes)

import type { LoaderContext } from "astro/loaders";

import { defineCollection, z } from "astro:content";
import { promises as fs } from "node:fs";
import path from "node:path";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import smartypants from "remark-smartypants";

import { rootAsSpan } from "~/utils/markdown/rootAsSpan";

import { pages } from "./collections/pages";
import { reviews } from "./collections/reviews";
import { alltimeStats, yearStats } from "./collections/stats";
import { loadMarkdownDirectory } from "./collections/utils/loadMarkdownDirectory";
import {
  ReadingLogSchema,
  ReviewedAuthorSchema,
  ReviewedWorkSchema,
} from "./schemas";

// --- Path helper ---

const CONTENT_ROOT = path.join(process.cwd(), "content");

function getBaseProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}

/** Load a directory of JSON files, one entry per file. */
async function loadJsonDirectory({
  directoryPath,
  getId = (raw) => raw.id as string,
  loaderContext,
}: {
  directoryPath: string;
  getId?: (raw: Record<string, unknown>) => string;
  loaderContext: LoaderContext;
}): Promise<void> {
  const sync = async () => {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    const jsonFiles = entries.filter(
      (e) => !e.isDirectory() && e.name.endsWith(".json"),
    );
    const newIds = new Set<string>();

    for (const entry of jsonFiles) {
      const filePath = path.join(directoryPath, entry.name);
      const raw = JSON.parse(await fs.readFile(filePath, "utf8")) as Record<
        string,
        unknown
      >;
      const id = getId(raw);
      newIds.add(id);

      const digest = loaderContext.generateDigest(raw);
      if (
        loaderContext.store.has(id) &&
        loaderContext.store.get(id)?.digest === digest
      ) {
        continue;
      }

      const data = await loaderContext.parseData({ data: raw, id });
      loaderContext.store.set({ data, digest, id });
    }

    for (const id of loaderContext.store.keys()) {
      if (!newIds.has(id)) loaderContext.store.delete(id);
    }
  };

  return watchDirectory(loaderContext, directoryPath, sync);
}

async function loadJsonSplitFile({
  directoryPath,
  getId = (raw) => raw.id as string,
  loaderContext,
}: {
  directoryPath: string;
  getId?: (raw: Record<string, unknown>) => string;
  loaderContext: LoaderContext;
}): Promise<void> {
  const sync = async () => {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    const jsonFiles = entries.filter(
      (e) => !e.isDirectory() && e.name.endsWith(".json"),
    );
    const newIds = new Set<string>();

    for (const file of jsonFiles) {
      const rawItems = JSON.parse(
        await fs.readFile(path.resolve(directoryPath, file.name), "utf8"),
      ) as Record<string, unknown>[];

      for (const raw of rawItems) {
        const id = getId(raw);
        newIds.add(id);

        const digest = loaderContext.generateDigest(raw);
        if (
          loaderContext.store.has(id) &&
          loaderContext.store.get(id)?.digest === digest
        ) {
          continue;
        }

        const data = await loaderContext.parseData({ data: raw, id });
        loaderContext.store.set({ data, digest, id });
      }
    }

    for (const id of loaderContext.store.keys()) {
      if (!newIds.has(id)) loaderContext.store.delete(id);
    }
  };

  return watchDirectory(loaderContext, directoryPath, sync);
}

/** Inline span HTML pipeline — wraps in <span>, no linkReviewedWorks */
function toInlineSpanHtml(content: string): string {
  return getBaseProcessor()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rootAsSpan)
    .use(rehypeStringify)
    .processSync(content)
    .toString();
}

/** Full block HTML pipeline — spans intact, linkReviewedWorks not applied */
function toIntermediateHtml(content: string): string {
  return getBaseProcessor()
    .use(remarkRehype, {
      allowDangerousHtml: true,
      footnoteBackContent: "↩\uFE0E",
    })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .processSync(content)
    .toString();
}

/** Run sync() immediately, then re-run it whenever any file in dirPath changes. */
async function watchDirectory(
  ctx: LoaderContext,
  dirPath: string,
  sync: () => Promise<void>,
): Promise<void> {
  await sync();
  ctx.watcher?.add(dirPath);
  ctx.watcher?.on("change", (changedPath) => {
    if (changedPath.startsWith(dirPath)) void sync();
  });
}

const TimelineEntrySchema = z.object({
  date: z.coerce.date(),
  progress: z.string(),
});

const ReadingSchema = z
  .object({
    body: z.string(),
    date: z.coerce.date(),
    edition: z.string(),
    editionNotes: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    intermediateEditionNotesHtml: z.string().optional(),
    intermediateReadingNotesHtml: z.string().optional(),
    isAbandoned: z.boolean(),
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
      intermediateEditionNotesHtml,
      intermediateReadingNotesHtml,
      isAbandoned,
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
        intermediateEditionNotesHtml,
        intermediateReadingNotesHtml,
        isAbandoned,
        readingTime,
        sequence,
        slug,
        timeline,
        workId,
      };
    },
  );

const reviewedAuthors = defineCollection({
  loader: {
    load: (ctx) =>
      loadJsonDirectory({
        directoryPath: path.join(CONTENT_ROOT, "data", "reviewed-authors"),
        getId: (raw) => raw.slug as string,
        loaderContext: ctx,
      }),
    name: "reviewed-authors-loader",
  },
  schema: ReviewedAuthorSchema,
});

const reviewedWorks = defineCollection({
  loader: {
    load: (ctx) =>
      loadJsonDirectory({
        directoryPath: path.join(CONTENT_ROOT, "data", "reviewed-works"),
        loaderContext: ctx,
      }),
    name: "reviewed-works-loader",
  },
  schema: ReviewedWorkSchema,
});

const readingLog = defineCollection({
  loader: {
    load: (ctx) =>
      loadJsonSplitFile({
        directoryPath: path.join(CONTENT_ROOT, "data", "reading-log"),
        loaderContext: ctx,
      }),
    name: "reading-log-loader",
  },
  schema: ReadingLogSchema,
});

const RawReadingFrontmatterSchema = z.object({
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
});

// export type WorkAuthor = z.infer<typeof WorkRawAuthorSchema>;

type RawReadingFrontmatter = z.infer<typeof RawReadingFrontmatterSchema>;

function computeReadingTime(readingFrontmatter: RawReadingFrontmatter): number {
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

const readings = defineCollection({
  loader: {
    load: (loaderContext) =>
      loadMarkdownDirectory({
        buildData: ({ body, frontmatter }) => {
          const parsedFrontmatter =
            RawReadingFrontmatterSchema.parse(frontmatter);

          const isAbandoned =
            parsedFrontmatter.timeline.at(-1)?.progress === "Abandoned";

          return {
            body,
            date: parsedFrontmatter.date,
            edition: parsedFrontmatter.edition,
            editionNotes: parsedFrontmatter.editionNotes,
            intermediateEditionNotesHtml: parsedFrontmatter.editionNotes?.trim()
              ? toInlineSpanHtml(parsedFrontmatter.editionNotes)
              : undefined,
            intermediateReadingNotesHtml: body.trim()
              ? toIntermediateHtml(body)
              : undefined,
            isAbandoned: isAbandoned,
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

export const collections = {
  alltimeStats,
  pages,
  readingLog,
  readings,
  reviewedAuthors,
  reviewedWorks,
  reviews,
  yearStats,
};
