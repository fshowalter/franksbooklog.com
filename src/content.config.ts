// AIDEV-NOTE: All eight content collections are defined here using custom inline loaders.
// These replace /src/api/data/*.ts file readers. Collection schemas are the single source
// of truth for typed data throughout the app.
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

import { defineCollection, reference, z } from "astro:content";
import matter from "gray-matter";
import { promises as fs } from "node:fs";
import path from "node:path";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import smartypants from "remark-smartypants";

import { removeFootnotes } from "~/api/utils/markdown/removeFootnotes";
import { rootAsSpan } from "~/api/utils/markdown/rootAsSpan";
import { trimToExcerpt } from "~/api/utils/markdown/trimToExcerpt";

// --- Path helper ---

const CONTENT_ROOT = path.join(process.cwd(), "content");

// --- Processing and loader helpers ---
// AIDEV-NOTE: The four load* helpers encapsulate the repeated sync/digest/watch
// boilerplate. Each accepts a LoaderContext (whole, not destructured — destructuring
// triggers @typescript-eslint/unbound-method) plus collection-specific callbacks.

function getBaseProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}

/** Load a single JSON file that contains an array of items, one entry per item. */
async function loadJsonArrayFile(
  ctx: LoaderContext,
  filePath: string,
  getId: (raw: Record<string, unknown>) => string,
): Promise<void> {
  const sync = async () => {
    const rawItems = JSON.parse(
      await fs.readFile(filePath, "utf8"),
    ) as Record<string, unknown>[];
    const newIds = new Set<string>();

    for (const raw of rawItems) {
      const id = getId(raw);
      newIds.add(id);

      const digest = ctx.generateDigest(raw);
      if (ctx.store.has(id) && ctx.store.get(id)?.digest === digest) {
        continue;
      }

      const data = await ctx.parseData({ data: raw, id });
      ctx.store.set({ data, digest, id });
    }

    for (const id of ctx.store.keys()) {
      if (!newIds.has(id)) ctx.store.delete(id);
    }
  };

  return watchFile(ctx, filePath, sync);
}

/** Load a directory of JSON files, one entry per file. */
async function loadJsonDirectory(
  ctx: LoaderContext,
  dirPath: string,
  getId: (raw: Record<string, unknown>) => string,
): Promise<void> {
  const sync = async () => {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const jsonFiles = entries.filter(
      (e) => !e.isDirectory() && e.name.endsWith(".json"),
    );
    const newIds = new Set<string>();

    for (const entry of jsonFiles) {
      const filePath = path.join(dirPath, entry.name);
      const raw = JSON.parse(
        await fs.readFile(filePath, "utf8"),
      ) as Record<string, unknown>;
      const id = getId(raw);
      newIds.add(id);

      const digest = ctx.generateDigest(raw);
      if (ctx.store.has(id) && ctx.store.get(id)?.digest === digest) {
        continue;
      }

      const data = await ctx.parseData({ data: raw, id });
      ctx.store.set({ data, digest, id });
    }

    for (const id of ctx.store.keys()) {
      if (!newIds.has(id)) ctx.store.delete(id);
    }
  };

  return watchDirectory(ctx, dirPath, sync);
}

/** Load a directory of Markdown files, one entry per file.
 *  getId derives the entry ID cheaply (no I/O); buildData runs the remark/rehype
 *  pipeline and is only called when the digest shows the file has changed. */
async function loadMarkdownDirectory(
  ctx: LoaderContext,
  dirPath: string,
  getId: (opts: {
    body: string;
    frontmatter: Record<string, unknown>;
    name: string;
  }) => string,
  buildData: (opts: {
    body: string;
    frontmatter: Record<string, unknown>;
    id: string;
  }) => Record<string, unknown>,
): Promise<void> {
  const sync = async () => {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const mdFiles = entries.filter(
      (e) => !e.isDirectory() && e.name.endsWith(".md"),
    );
    const newIds = new Set<string>();

    for (const entry of mdFiles) {
      const filePath = path.join(dirPath, entry.name);
      const fileContents = await fs.readFile(filePath, "utf8");
      const { content: body, data: frontmatter } = matter(fileContents);
      const id = getId({ body, frontmatter, name: entry.name });
      newIds.add(id);

      // Digest raw content to skip expensive remark/rehype re-processing
      const digest = ctx.generateDigest({ body, frontmatter });
      if (ctx.store.has(id) && ctx.store.get(id)?.digest === digest) {
        continue;
      }

      // buildData runs remark/rehype WITHOUT linkReviewedWorks (applied in API layer)
      const data = await ctx.parseData({
        data: buildData({ body, frontmatter, id }),
        id,
      });
      ctx.store.set({ data, digest, id });
    }

    for (const id of ctx.store.keys()) {
      if (!newIds.has(id)) ctx.store.delete(id);
    }
  };

  return watchDirectory(ctx, dirPath, sync);
}

/** Load a single JSON object file as one store entry with a fixed id. */
async function loadSingleJsonFile(
  ctx: LoaderContext,
  filePath: string,
  id: string,
): Promise<void> {
  const sync = async () => {
    const raw = JSON.parse(
      await fs.readFile(filePath, "utf8"),
    ) as Record<string, unknown>;
    const digest = ctx.generateDigest(raw);

    if (ctx.store.has(id) && ctx.store.get(id)?.digest === digest) {
      return;
    }

    const data = await ctx.parseData({ data: raw, id });
    ctx.store.set({ data, digest, id });
  };

  return watchFile(ctx, filePath, sync);
}

/** Excerpt HTML pipeline — truncates to first paragraph, no linkReviewedWorks */
function toExcerptHtml(content: string): string {
  return getBaseProcessor()
    .use(removeFootnotes)
    .use(trimToExcerpt)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .processSync(content)
    .toString();
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

/** Run sync() immediately, then re-run it whenever filePath changes. */
async function watchFile(
  ctx: LoaderContext,
  filePath: string,
  sync: () => Promise<void>,
): Promise<void> {
  await sync();
  ctx.watcher?.add(filePath);
  ctx.watcher?.on("change", (changedPath) => {
    if (changedPath === filePath) void sync();
  });
}

// --- Shared Zod sub-schemas ---

const DistributionSchema = z.object({
  count: z.number(),
  name: z.string(),
});

const GradeDistributionSchema = DistributionSchema.extend({
  sortValue: z.number(),
});

const MostReadAuthorReadingSchema = z.object({
  date: z.string(),
  edition: z.string(),
  includedInSlugs: z.array(z.string()),
  kind: z.string(),
  readingSequence: z.number(),
  reviewed: z.boolean(),
  slug: z.string(),
  title: z.string(),
  workYear: z.string(),
});

const MostReadAuthorSchema = z
  .object({
    count: z.number(),
    name: z.string(),
    readings: z.array(MostReadAuthorReadingSchema),
    reviewed: z.boolean(),
    slug: z.string(),
  })
  .transform(({ count, name, readings, reviewed, slug }) => {
    // fix zod making anything with undefined optional
    return { count, name, readings, reviewed, slug };
  });

const WorkKindSchema = z.enum([
  "Anthology",
  "Collection",
  "Nonfiction",
  "Novel",
  "Novella",
  "Short Story",
]);

// --- Collection schemas ---

const AuthorSchema = z.object({
  name: z.string(),
  reviewedWorks: z.array(reference("reviewedWorks")),
  slug: z.string(),
  sortName: z.string(),
});

const WorkAuthorSchema = z
  .object({
    name: z.string(),
    notes: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    slug: z.string(),
    sortName: z.string(),
  })
  .transform(({ name, notes, slug, sortName }) => {
    // fix zod making anything with undefined optional
    return { name, notes, slug, sortName };
  });

const IncludedWorkAuthorSchema = z.object({
  name: z.string(),
  slug: z.string(),
});

const IncludedWorkSchema = z.object({
  authors: z.array(IncludedWorkAuthorSchema),
  grade: z
    .nullable(z.string())
    .optional()
    .transform((v) => v ?? undefined),
  kind: WorkKindSchema,
  reviewed: z.boolean(),
  slug: z.string(),
  title: z.string(),
  workYear: z.string(),
});

// AIDEV-NOTE: moreByAuthors[].reviewedWorks uses reference() — the exporter emits slug
// strings directly; parseData() coerces them to { collection, id } objects automatically.
// The outer author metadata (name, slug, sortName) is small and embedded directly.
const ContentMoreByAuthorSchema = z.object({
  name: z.string(),
  reviewedWorks: z.array(reference("reviewedWorks")),
  slug: z.string(),
  sortName: z.string(),
});

const ReviewedWorkReadingSchema = z.object({
  abandoned: z.boolean(),
  date: z.coerce.date(),
  isAudiobook: z.boolean(),
  readingSequence: z.number(),
  readingTime: z.number(),
});

// AIDEV-NOTE: moreReviews uses reference('reviewedWorks') — the exporter emits slug
// strings directly; parseData() coerces them automatically. includedWorks does NOT use
// reference() because some entries have reviewed: false and won't exist in the collection.
const ReviewedWorkSchema = z
  .object({
    authors: z.array(WorkAuthorSchema),
    grade: z.string(),
    gradeValue: z.number(),
    includedInSlugs: z.array(z.string()),
    includedWorks: z.array(IncludedWorkSchema).optional(),
    kind: WorkKindSchema,
    moreByAuthors: z.array(ContentMoreByAuthorSchema),
    moreReviews: z.array(reference("reviewedWorks")),
    readings: z.array(ReviewedWorkReadingSchema),
    reviewDate: z.string(),
    reviewSequence: z.string(),
    reviewYear: z.string(),
    slug: z.string(),
    sortTitle: z.string(),
    subtitle: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    title: z.string(),
    workYear: z.string(),
  })
  .transform(
    ({
      authors,
      grade,
      gradeValue,
      includedInSlugs,
      includedWorks,
      kind,
      moreByAuthors,
      moreReviews,
      readings,
      reviewDate,
      reviewSequence,
      reviewYear,
      slug,
      sortTitle,
      subtitle,
      title,
      workYear,
    }) => {
      // fix zod making anything with undefined optional
      return {
        authors,
        grade,
        gradeValue,
        includedInSlugs,
        includedWorks: includedWorks ?? [],
        kind,
        moreByAuthors,
        moreReviews,
        readings,
        reviewDate,
        reviewSequence,
        reviewYear,
        slug,
        sortTitle,
        subtitle,
        title,
        workYear,
      };
    },
  );

const ReadingEntryAuthorSchema = z.object({
  name: z.string(),
  slug: z.string(),
  sortName: z.string(),
});

const ReadingEntrySchema = z.object({
  authors: z.array(ReadingEntryAuthorSchema),
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

const TimelineEntrySchema = z.object({
  date: z.coerce.date(),
  progress: z.string(),
});

// AIDEV-NOTE: work_slug is a plain string in frontmatter; parseData() handles the
// reference('reviewedWorks') coercion automatically, converting to { collection, id }.
const ReviewSchema = z.object({
  body: z.string(),
  date: z.coerce.date(),
  excerptHtml: z.string(),
  grade: z.string(),
  intermediateHtml: z.string(),
  synopsis: z.optional(z.string()),
  work_slug: reference("reviewedWorks"),
});

// AIDEV-NOTE: edition_notes accepts null from YAML (edition_notes: ~) or is absent.
// intermediateReadingNotesHtml and intermediateEditionNotesHtml are optional because
// reading notes and edition notes may be absent.
const ReadingSchema = z
  .object({
    body: z.string(),
    edition: z.string(),
    edition_notes: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    intermediateEditionNotesHtml: z.string().optional(),
    intermediateReadingNotesHtml: z.string().optional(),
    sequence: z.number(),
    timeline: z.array(TimelineEntrySchema),
    work_slug: reference("reviewedWorks"),
  })
  .transform(
    ({
      body,
      edition,
      edition_notes,
      intermediateEditionNotesHtml,
      intermediateReadingNotesHtml,
      sequence,
      timeline,
      work_slug,
    }) => {
      // fix zod making anything with undefined optional
      return {
        body,
        edition,
        edition_notes,
        intermediateEditionNotesHtml,
        intermediateReadingNotesHtml,
        sequence,
        timeline,
        work_slug,
      };
    },
  );

const PageSchema = z.object({
  body: z.string(),
  intermediateHtml: z.string(),
  slug: z.string(),
  title: z.string(),
});

const AlltimeStatSchema = z.object({
  bookCount: z.number(),
  decadeDistribution: z.array(DistributionSchema),
  editionDistribution: z.array(DistributionSchema),
  gradeDistribution: z.array(GradeDistributionSchema),
  kindDistribution: z.array(DistributionSchema),
  mostReadAuthors: z.array(MostReadAuthorSchema),
  reviewCount: z.number(),
  workCount: z.number(),
});

const YearStatSchema = z.object({
  bookCount: z.number(),
  decadeDistribution: z.array(DistributionSchema),
  editionDistribution: z.array(DistributionSchema),
  kindDistribution: z.array(DistributionSchema),
  mostReadAuthors: z.array(MostReadAuthorSchema),
  workCount: z.number(),
  year: z.string(),
});

// --- Collection definitions ---

const authors = defineCollection({
  loader: {
    load: (ctx) =>
      loadJsonDirectory(
        ctx,
        path.join(CONTENT_ROOT, "data", "authors"),
        (raw) => raw.slug as string,
      ),
    name: "authors-loader",
  },
  schema: AuthorSchema,
});

const reviewedWorks = defineCollection({
  loader: {
    load: (ctx) =>
      loadJsonArrayFile(
        ctx,
        path.join(CONTENT_ROOT, "data", "reviewed-works.json"),
        (raw) => raw.slug as string,
      ),
    name: "reviewed-works-loader",
  },
  schema: ReviewedWorkSchema,
});

const readingEntries = defineCollection({
  loader: {
    load: (ctx) =>
      loadJsonArrayFile(
        ctx,
        path.join(CONTENT_ROOT, "data", "reading-entries.json"),
        (raw) => String(raw.readingEntrySequence as number),
      ),
    name: "reading-entries-loader",
  },
  schema: ReadingEntrySchema,
});

const reviews = defineCollection({
  loader: {
    load: (ctx) =>
      loadMarkdownDirectory(
        ctx,
        path.join(CONTENT_ROOT, "reviews"),
        ({ name }) => name.replace(/\.md$/, ""),
        ({ body, frontmatter }) => {
          const excerptContent =
            (frontmatter.synopsis as string | undefined)?.trim() || body;
          return {
            body,
            date: frontmatter.date,
            excerptHtml: toExcerptHtml(excerptContent),
            grade: frontmatter.grade as string,
            intermediateHtml: toIntermediateHtml(body),
            synopsis: frontmatter.synopsis as string | undefined,
            work_slug: frontmatter.work_slug as string,
          };
        },
      ),
    name: "reviews-loader",
  },
  schema: ReviewSchema,
});

const readings = defineCollection({
  loader: {
    load: (ctx) =>
      loadMarkdownDirectory(
        ctx,
        path.join(CONTENT_ROOT, "readings"),
        ({ name }) => name.replace(/\.md$/, ""),
        ({ body, frontmatter }) => {
          const editionNotes = frontmatter.edition_notes as
            | null
            | string
            | undefined;
          return {
            body,
            edition: frontmatter.edition as string,
            edition_notes: editionNotes,
            intermediateEditionNotesHtml: editionNotes?.trim()
              ? toInlineSpanHtml(editionNotes)
              : undefined,
            intermediateReadingNotesHtml: body.trim()
              ? toIntermediateHtml(body)
              : undefined,
            sequence: frontmatter.sequence as number,
            timeline: frontmatter.timeline as unknown[],
            work_slug: frontmatter.work_slug as string,
          };
        },
      ),
    name: "readings-loader",
  },
  schema: ReadingSchema,
});

const pages = defineCollection({
  loader: {
    load: (ctx) =>
      loadMarkdownDirectory(
        ctx,
        path.join(CONTENT_ROOT, "pages"),
        ({ frontmatter }) => frontmatter.slug as string,
        ({ body, frontmatter }) => ({
          body,
          intermediateHtml: toIntermediateHtml(body),
          slug: frontmatter.slug as string,
          title: frontmatter.title as string,
        }),
      ),
    name: "pages-loader",
  },
  schema: PageSchema,
});

const alltimeStats = defineCollection({
  loader: {
    load: (ctx) =>
      loadSingleJsonFile(
        ctx,
        path.join(CONTENT_ROOT, "data", "all-time-stats.json"),
        "alltime",
      ),
    name: "alltime-stats-loader",
  },
  schema: AlltimeStatSchema,
});

const yearStats = defineCollection({
  loader: {
    load: (ctx) =>
      loadJsonDirectory(
        ctx,
        path.join(CONTENT_ROOT, "data", "year-stats"),
        (raw) => raw.year as string,
      ),
    name: "year-stats-loader",
  },
  schema: YearStatSchema,
});

// --- Exported types ---
// These are the single source of truth for typed data in tests and API functions.
// Import from this file when writing fixtures or type-annotating collection data.

export type AlltimeStatData = z.infer<typeof AlltimeStatSchema>;
export type AuthorData = z.infer<typeof AuthorSchema>;
export type PageData = z.infer<typeof PageSchema>;
export type ReadingData = z.infer<typeof ReadingSchema>;
export type ReadingEntryData = z.infer<typeof ReadingEntrySchema>;
export type ReviewData = z.infer<typeof ReviewSchema>;
export type ReviewedWorkData = z.infer<typeof ReviewedWorkSchema>;
export type YearStatData = z.infer<typeof YearStatSchema>;

export const collections = {
  alltimeStats,
  authors,
  pages,
  readingEntries,
  readings,
  reviewedWorks,
  reviews,
  yearStats,
};
