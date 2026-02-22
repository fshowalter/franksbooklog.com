// AIDEV-NOTE: All eight content collections are defined here using custom inline loaders.
// These replace /src/api/data/*.ts file readers. Collection schemas are the single source
// of truth for typed data throughout the app.
//
// Key gotchas:
// - Always call ctx.parseData() before store.set() — Zod transforms (z.coerce.date())
//   only run if parseData is called
// - Call ctx.parseData and ctx.generateDigest via ctx. (not destructured) to avoid
//   @typescript-eslint/unbound-method lint errors
// - Strip embedded objects to ID strings before parseData() for reference() fields
// - linkReviewedWorks is NOT applied in loaders — loaders store intermediate HTML
//   with <span data-work-slug=""> spans intact; linking happens at build time in API layer
// - Object literal keys must be alphabetically sorted (perfectionist/sort-objects rule)
// - If loader data seems stale after a remark pipeline change, delete
//   .astro/data-store.json to force a rebuild (raw-content digests don't capture
//   pipeline changes)

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

// --- Markdown processing helpers ---
// These run the remark/rehype pipeline WITHOUT linkReviewedWorks.
// linkReviewedWorks is applied later in the API layer with the live reviewedWorks array.

type RawAuthor = {
  name: string;
  reviewedWorks: RawAuthorWork[];
  slug: string;
  sortName: string;
};

type RawAuthorWork = { slug: string };

type RawMoreByAuthor = {
  name: string;
  reviewedWorks: RawMoreReview[];
  slug: string;
  sortName: string;
};

type RawMoreReview = { slug: string };

// --- Minimal raw JSON types for loader transformations ---
// Only fields that need transformation are typed explicitly; [key: string]: unknown
// captures all other fields for safe spreading into parseData.

type RawReviewedWork = {
  [key: string]: unknown;
  moreByAuthors: RawMoreByAuthor[];
  moreReviews: RawMoreReview[];
  slug: string;
};
function getBaseProcessor() {
  return remark().use(remarkGfm).use(smartypants);
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

// AIDEV-NOTE: moreByAuthors[].reviewedWorks uses reference() — loader strips embedded
// objects to slug strings before parseData(). The outer author metadata (name, slug,
// sortName) is small and embedded directly; only the inner work list uses references.
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

// AIDEV-NOTE: moreReviews uses reference('reviewedWorks') — loader strips embedded
// objects to slug strings before parseData(). includedWorks does NOT use reference()
// because some entries have reviewed: false and won't exist in reviewedWorks collection.
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
    load: async (ctx) => {
      const dirPath = path.join(CONTENT_ROOT, "data", "authors");

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
          ) as RawAuthor;
          const id = raw.slug;
          newIds.add(id);

          const digest = ctx.generateDigest(raw as Record<string, unknown>);
          if (ctx.store.has(id) && ctx.store.get(id)?.digest === digest) {
            continue;
          }

          // Strip embedded work objects to slug strings for reference() fields
          const data = await ctx.parseData({
            data: {
              ...raw,
              reviewedWorks: raw.reviewedWorks.map((w) => w.slug),
            },
            id,
          });
          ctx.store.set({ data, digest, id });
        }

        // Remove stale entries
        for (const id of ctx.store.keys()) {
          if (!newIds.has(id)) ctx.store.delete(id);
        }
      };

      await sync();

      // HMR: watch authors directory in dev mode
      ctx.watcher?.add(dirPath);
      ctx.watcher?.on("change", (changedPath) => {
        if (changedPath.startsWith(dirPath)) void sync();
      });
    },
    name: "authors-loader",
  },
  schema: AuthorSchema,
});

const reviewedWorks = defineCollection({
  loader: {
    load: async (ctx) => {
      const filePath = path.join(CONTENT_ROOT, "data", "reviewed-works.json");

      const sync = async () => {
        const rawItems = JSON.parse(
          await fs.readFile(filePath, "utf8"),
        ) as RawReviewedWork[];

        const newIds = new Set<string>();

        for (const raw of rawItems) {
          const id = raw.slug;
          newIds.add(id);

          const digest = ctx.generateDigest(raw);
          if (ctx.store.has(id) && ctx.store.get(id)?.digest === digest) {
            continue;
          }

          // Strip embedded objects to ID strings for reference() fields before parseData()
          const data = await ctx.parseData({
            data: {
              ...raw,
              moreByAuthors: raw.moreByAuthors.map((a) => ({
                ...a,
                reviewedWorks: a.reviewedWorks.map((w) => w.slug),
              })),
              moreReviews: raw.moreReviews.map((r) => r.slug),
            },
            id,
          });
          ctx.store.set({ data, digest, id });
        }

        // Remove stale entries
        for (const id of ctx.store.keys()) {
          if (!newIds.has(id)) ctx.store.delete(id);
        }
      };

      await sync();

      // HMR: watch the single JSON file
      ctx.watcher?.add(filePath);
      ctx.watcher?.on("change", (changedPath) => {
        if (changedPath === filePath) void sync();
      });
    },
    name: "reviewed-works-loader",
  },
  schema: ReviewedWorkSchema,
});

const readingEntries = defineCollection({
  loader: {
    load: async (ctx) => {
      const filePath = path.join(
        CONTENT_ROOT,
        "data",
        "reading-entries.json",
      );

      const sync = async () => {
        const rawItems = JSON.parse(
          await fs.readFile(filePath, "utf8"),
        ) as (Record<string, unknown> & { readingEntrySequence: number })[];

        const newIds = new Set<string>();

        for (const raw of rawItems) {
          const id = String(raw.readingEntrySequence);
          newIds.add(id);

          const digest = ctx.generateDigest(raw);
          if (ctx.store.has(id) && ctx.store.get(id)?.digest === digest) {
            continue;
          }

          const data = await ctx.parseData({ data: raw, id });
          ctx.store.set({ data, digest, id });
        }

        // Remove stale entries
        for (const id of ctx.store.keys()) {
          if (!newIds.has(id)) ctx.store.delete(id);
        }
      };

      await sync();

      // HMR: watch the single JSON file
      ctx.watcher?.add(filePath);
      ctx.watcher?.on("change", (changedPath) => {
        if (changedPath === filePath) void sync();
      });
    },
    name: "reading-entries-loader",
  },
  schema: ReadingEntrySchema,
});

const reviews = defineCollection({
  loader: {
    load: async (ctx) => {
      const dirPath = path.join(CONTENT_ROOT, "reviews");

      const sync = async () => {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        const mdFiles = entries.filter(
          (e) => !e.isDirectory() && e.name.endsWith(".md"),
        );

        const newIds = new Set<string>();

        for (const entry of mdFiles) {
          const filePath = path.join(dirPath, entry.name);
          const id = entry.name.replace(/\.md$/, "");
          newIds.add(id);

          const fileContents = await fs.readFile(filePath, "utf8");
          const { content: body, data: frontmatter } = matter(fileContents);

          // Digest raw content to skip expensive remark/rehype re-processing
          const digest = ctx.generateDigest({ body, frontmatter });
          if (ctx.store.has(id) && ctx.store.get(id)?.digest === digest) {
            continue;
          }

          // Run remark/rehype WITHOUT linkReviewedWorks (applied later in API layer)
          const intermediateHtml = toIntermediateHtml(body);

          // Excerpt: synopsis or first paragraph, fully processed (no linking needed)
          const excerptContent =
            (frontmatter.synopsis as string | undefined)?.trim() || body;
          const excerptHtml = toExcerptHtml(excerptContent);

          const data = await ctx.parseData({
            data: {
              body,
              date: frontmatter.date as unknown,
              excerptHtml,
              grade: frontmatter.grade as string,
              intermediateHtml,
              synopsis: frontmatter.synopsis as string | undefined,
              work_slug: frontmatter.work_slug as string,
            },
            id,
          });
          ctx.store.set({ data, digest, id });
        }

        // Remove stale entries
        for (const id of ctx.store.keys()) {
          if (!newIds.has(id)) ctx.store.delete(id);
        }
      };

      await sync();

      // HMR: watch reviews directory
      ctx.watcher?.add(dirPath);
      ctx.watcher?.on("change", (changedPath) => {
        if (changedPath.startsWith(dirPath)) void sync();
      });
    },
    name: "reviews-loader",
  },
  schema: ReviewSchema,
});

const readings = defineCollection({
  loader: {
    load: async (ctx) => {
      const dirPath = path.join(CONTENT_ROOT, "readings");

      const sync = async () => {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        const mdFiles = entries.filter(
          (e) => !e.isDirectory() && e.name.endsWith(".md"),
        );

        const newIds = new Set<string>();

        for (const entry of mdFiles) {
          const filePath = path.join(dirPath, entry.name);
          const id = entry.name.replace(/\.md$/, "");
          newIds.add(id);

          const fileContents = await fs.readFile(filePath, "utf8");
          const { content: body, data: frontmatter } = matter(fileContents);

          // Digest raw content to skip expensive remark/rehype re-processing
          const digest = ctx.generateDigest({ body, frontmatter });
          if (ctx.store.has(id) && ctx.store.get(id)?.digest === digest) {
            continue;
          }

          // Run remark/rehype WITHOUT linkReviewedWorks (applied later in API layer)
          const intermediateReadingNotesHtml = body.trim()
            ? toIntermediateHtml(body)
            : undefined;
          const editionNotes = frontmatter.edition_notes as
            | null
            | string
            | undefined;
          const intermediateEditionNotesHtml = editionNotes?.trim()
            ? toInlineSpanHtml(editionNotes)
            : undefined;

          const data = await ctx.parseData({
            data: {
              body,
              edition: frontmatter.edition as string,
              edition_notes: editionNotes,
              intermediateEditionNotesHtml,
              intermediateReadingNotesHtml,
              sequence: frontmatter.sequence as number,
              timeline: frontmatter.timeline as unknown[],
              work_slug: frontmatter.work_slug as string,
            },
            id,
          });
          ctx.store.set({ data, digest, id });
        }

        // Remove stale entries
        for (const id of ctx.store.keys()) {
          if (!newIds.has(id)) ctx.store.delete(id);
        }
      };

      await sync();

      // HMR: watch readings directory
      ctx.watcher?.add(dirPath);
      ctx.watcher?.on("change", (changedPath) => {
        if (changedPath.startsWith(dirPath)) void sync();
      });
    },
    name: "readings-loader",
  },
  schema: ReadingSchema,
});

const pages = defineCollection({
  loader: {
    load: async (ctx) => {
      const dirPath = path.join(CONTENT_ROOT, "pages");

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

          const id = frontmatter.slug as string;
          newIds.add(id);

          // Digest raw content to skip expensive remark/rehype re-processing
          const digest = ctx.generateDigest({ body, frontmatter });
          if (ctx.store.has(id) && ctx.store.get(id)?.digest === digest) {
            continue;
          }

          // Run remark/rehype WITHOUT linkReviewedWorks (applied later in API layer)
          const intermediateHtml = toIntermediateHtml(body);

          const data = await ctx.parseData({
            data: {
              body,
              intermediateHtml,
              slug: frontmatter.slug as string,
              title: frontmatter.title as string,
            },
            id,
          });
          ctx.store.set({ data, digest, id });
        }

        // Remove stale entries
        for (const id of ctx.store.keys()) {
          if (!newIds.has(id)) ctx.store.delete(id);
        }
      };

      await sync();

      // HMR: watch pages directory
      ctx.watcher?.add(dirPath);
      ctx.watcher?.on("change", (changedPath) => {
        if (changedPath.startsWith(dirPath)) void sync();
      });
    },
    name: "pages-loader",
  },
  schema: PageSchema,
});

const alltimeStats = defineCollection({
  loader: {
    load: async (ctx) => {
      const filePath = path.join(CONTENT_ROOT, "data", "all-time-stats.json");
      const id = "alltime";

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

      await sync();

      // HMR: watch the single JSON file
      ctx.watcher?.add(filePath);
      ctx.watcher?.on("change", (changedPath) => {
        if (changedPath === filePath) void sync();
      });
    },
    name: "alltime-stats-loader",
  },
  schema: AlltimeStatSchema,
});

const yearStats = defineCollection({
  loader: {
    load: async (ctx) => {
      const dirPath = path.join(CONTENT_ROOT, "data", "year-stats");

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
          ) as Record<string, unknown> & { year: string };
          const id = raw.year;
          newIds.add(id);

          const digest = ctx.generateDigest(raw);
          if (ctx.store.has(id) && ctx.store.get(id)?.digest === digest) {
            continue;
          }

          const data = await ctx.parseData({ data: raw, id });
          ctx.store.set({ data, digest, id });
        }

        // Remove stale entries
        for (const id of ctx.store.keys()) {
          if (!newIds.has(id)) ctx.store.delete(id);
        }
      };

      await sync();

      // HMR: watch year-stats directory
      ctx.watcher?.add(dirPath);
      ctx.watcher?.on("change", (changedPath) => {
        if (changedPath.startsWith(dirPath)) void sync();
      });
    },
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
