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

import { getContentPlainText } from "./api/reviews";
import {
  AlltimeStatsSchema,
  ReviewedWorkSchema,
  // WorkSchema,
  YearStatsSchema,
} from "./content/schemas";

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
async function loadJsonArrayFile({
  filePath,
  loaderContext,
}: {
  filePath: string;
  loaderContext: LoaderContext;
}): Promise<void> {
  const sync = async () => {
    const rawItems = JSON.parse(await fs.readFile(filePath, "utf8")) as Record<
      string,
      unknown
    >[];

    const newIds = new Set<string>();

    for (const raw of rawItems) {
      const id = raw.id as string;
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

  return watchFile(loaderContext, filePath, sync);
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
async function loadSingleJsonFile({
  filePath,
  id,
  loaderContext,
}: {
  filePath: string;
  id: string;
  loaderContext: LoaderContext;
}): Promise<void> {
  const sync = async () => {
    const raw = JSON.parse(await fs.readFile(filePath, "utf8")) as Record<
      string,
      unknown
    >;
    const digest = loaderContext.generateDigest(raw);

    if (
      loaderContext.store.has(id) &&
      loaderContext.store.get(id)?.digest === digest
    ) {
      return;
    }

    const data = await loaderContext.parseData({ data: raw, id });
    loaderContext.store.set({ data, digest, id });
  };

  return watchFile(loaderContext, filePath, sync);
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

// const DistributionSchema = z.object({
//   count: z.number(),
//   name: z.string(),
// });

// AIDEV-NOTE: readings is z.array(reference("readings")) — source JSON contains plain
// reading slug strings; parseData() coerces them to { collection, id } objects.
// const MostReadAuthorSchema = z
//   .object({
//     author: reference("authors"),
//     count: z.number(),
//     readings: z.array(reference("readings")),
//     reviewed: z.boolean(),
//   })
//   .transform(({ author, count, readings, reviewed }) => {
//     // fix zod making anything with undefined optional
//     return { author, count, readings, reviewed };
//   });

// export type MostReadAuthor = z.infer<typeof MostReadAuthorSchema>;

// const WorkKindSchema = z.enum([
//   "Anthology",
//   "Collection",
//   "Nonfiction",
//   "Novel",
//   "Novella",
//   "Short Story",
// ]);

// --- Collection schemas ---

const AuthorSchema = z.object({
  name: z.string(),
  slug: z.string(),
  sortName: z.string(),
});

// AIDEV-NOTE: WorkRawAuthorSchema is the shape of authors inside works/*.json — just slug
// and optional notes. Names are looked up from the authors collection at getProps time.
// const WorkRawAuthorSchema = z
//   .object({
//     author: reference("authors"),
//     notes: z
//       .nullable(z.string())
//       .optional()
//       .transform((v) => v ?? undefined),
//   })
//   .transform(({ author, notes }) => {
//     // fix zod making anything with undefined optional
//     return { author, notes };
//   });

// AIDEV-NOTE: WorkSchema transforms `year` → `workYear` to match the field name used
// throughout the app. `includedWorks` is plain slug strings (not references) because
// some included works are unreviewed and would fail reference validation.
// const WorkSchema = z
//   .object({
//     authors: z.array(WorkRawAuthorSchema),
//     includedWorks: z.array(reference("works")),
//     kind: WorkKindSchema,
//     slug: z.string(),
//     sortTitle: z.string(),
//     subtitle: z
//       .nullable(z.string())
//       .optional()
//       .transform((v) => v ?? undefined),
//     title: z.string(),
//     year: z.string(),
//   })
//   .transform(
//     ({
//       authors,
//       includedWorks,
//       kind,
//       slug,
//       sortTitle,
//       subtitle,
//       title,
//       year,
//     }) => {
//       // fix zod making anything with undefined optional; rename year → workYear
//       return {
//         authors,
//         includedWorks,
//         kind,
//         slug,
//         sortTitle,
//         subtitle,
//         title,
//         workYear: year,
//       };
//     },
//   );

const TimelineEntrySchema = z.object({
  date: z.coerce.date(),
  progress: z.string(),
});

// AIDEV-NOTE: slug references the 'works' collection — parseData() coerces the plain
// frontmatter string to { collection: "works", id } automatically.
const ReviewSchema = z.object({
  body: z.string(),
  date: z.coerce.date(),
  description: z.string(),
  excerptHtml: z.string(),
  excerptPlainText: z.string(),
  grade: z.string(),
  intermediateHtml: z.string(),
  more: reference("moreForReviewedWorks"),
  slug: z.string(),
  synopsis: z.optional(z.string()),
  work: reference("works"),
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

const PageSchema = z.object({
  body: z.string(),
  description: z.string(),
  intermediateHtml: z.string(),
  slug: z.string(),
  title: z.string(),
});

// const YearStatSchema = z.object({
//   bookCount: z.number(),
//   decadeDistribution: z.array(DistributionSchema),
//   editionDistribution: z.array(DistributionSchema),
//   kindDistribution: z.array(DistributionSchema),
//   mostReadAuthors: z.array(MostReadAuthorSchema),
//   workCount: z.number(),
//   year: z.string(),
// });

// --- Collection definitions ---

const authors = defineCollection({
  loader: {
    load: (ctx) =>
      loadJsonDirectory({
        directoryPath: path.join(CONTENT_ROOT, "data", "authors"),
        getId: (raw) => raw.slug as string,
        loaderContext: ctx,
      }),
    name: "authors-loader",
  },
  schema: AuthorSchema,
});

// const works = defineCollection({
//   loader: {
//     load: (ctx) =>
//       loadJsonDirectory(
//         ctx,
//         path.join(CONTENT_ROOT, "data", "works"),
//         (raw) => raw.id as string,
//       ),
//     name: "works-loader",
//   },
//   schema: WorkSchema,
// });

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

          const contentPlainText = getContentPlainText(body);

          //trim the string to the maximum length
          let description = contentPlainText
            .replaceAll(/\r?\n|\r/g, " ")
            .slice(0, Math.max(0, 160));

          //re-trim if we are in the middle of a word
          description = description.slice(
            0,
            Math.max(
              0,
              Math.min(description.length, description.lastIndexOf(" ")),
            ),
          );
          return {
            body,
            date: frontmatter.date,
            description,
            excerptHtml: toExcerptHtml(excerptContent),
            excerptPlainText: excerptContent,
            grade: frontmatter.grade as string,
            intermediateHtml: toIntermediateHtml(body),
            more: frontmatter.slug,
            slug: frontmatter.slug as string,
            synopsis: frontmatter.synopsis as string | undefined,
            work: frontmatter.slug as string,
          };
        },
      ),
    name: "reviews-loader",
  },
  schema: ReviewSchema,
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
    load: (ctx) =>
      loadMarkdownDirectory(
        ctx,
        path.join(CONTENT_ROOT, "readings"),
        ({ name }) => name.replace(/\.md$/, ""),
        ({ body, frontmatter }) => {
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
        ({ body, frontmatter }) => {
          const contentPlainText = getContentPlainText(body);

          //trim the string to the maximum length
          let description = contentPlainText
            .replaceAll(/\r?\n|\r/g, " ")
            .slice(0, Math.max(0, 160));

          //re-trim if we are in the middle of a word
          description = description.slice(
            0,
            Math.max(
              0,
              Math.min(description.length, description.lastIndexOf(" ")),
            ),
          );

          return {
            body,
            description,
            intermediateHtml: toIntermediateHtml(body),
            slug: frontmatter.slug as string,
            title: frontmatter.title as string,
          };
        },
      ),
    name: "pages-loader",
  },
  schema: PageSchema,
});

const alltimeStats = defineCollection({
  loader: {
    load: (loaderContext) =>
      loadSingleJsonFile({
        filePath: path.join(CONTENT_ROOT, "data", "all-time-stats.json"),
        id: "alltimeStats",
        loaderContext,
      }),
    name: "alltime-stats-loader",
  },
  schema: AlltimeStatsSchema,
});

const yearStats = defineCollection({
  loader: {
    load: (ctx) =>
      loadJsonDirectory({
        directoryPath: path.join(CONTENT_ROOT, "data", "year-stats"),
        getId: (raw) => raw.year as string,
        loaderContext: ctx,
      }),
    name: "year-stats-loader",
  },
  schema: YearStatsSchema,
});

// --- Exported types ---
// These are the single source of truth for typed data in tests and API functions.
// Import from this file when writing fixtures or type-annotating collection data.

export type AuthorData = z.infer<typeof AuthorSchema>;
export type PageData = z.infer<typeof PageSchema>;
export type ReadingData = z.infer<typeof ReadingSchema>;
export type ReviewData = z.infer<typeof ReviewSchema>;

export const collections = {
  alltimeStats,
  authors,
  pages,
  readings,
  reviewedWorks,
  reviews,
  // works,
  yearStats,
};
