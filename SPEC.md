# Content Collections Migration: Specification

## Overview

This spec defines the migration from the custom data loading layer (`/src/api/data/`) to
Astro's native Content Collections API (content layer with custom inline loaders). The goal
is to replace the home-grown JSON/Markdown file-reading code with first-class Astro
primitives while making all API-layer functions pure and independently testable.

## Goals

1. Replace `/src/api/data/*.ts` file readers with Astro content collection loaders
2. Replace data consumed by `authors.ts`, `pages.ts`, `readings.ts`, `reviews.ts`, and
   `stats.ts` with `getCollection()` calls in the Astro pages that invoke them
3. Make those five API functions pure — accepting pre-fetched collection data as
   parameters rather than fetching internally
4. Eliminate the custom build-time caching layer (replaced by Astro's content store)
5. Eliminate `getContentPath` and its test coverage exclusion
6. Remove the custom `contentHmr()` Vite plugin (Astro content collections have built-in
   file watching)
7. Maintain full feature and behavioral parity throughout

## Non-Goals

- Migrating image optimization (`covers.ts`, `avatars.ts`, `backdrops.ts`)
- Rewriting the remark/rehype HTML processing pipeline
- Changing component, reducer, or UI code beyond what's forced by signature changes
- Adding new features or changing user-facing output

---

## Current Architecture

```
/content/                     File system
    ↓
/src/api/data/*.ts            Load + Zod-validate + cache
    ↓
/src/api/*.ts                 Combine, enrich, transform
    ↓
/src/features/*/getProps.ts   Prepare component props (images, formatting)
    ↓
/src/pages/*.astro            Render
```

Data layer functions read files from `/content/` using `getContentPath`, validate with Zod
schemas, and cache results in module-level `Map`s during builds. The caching is disabled in
DEV mode via the `ENABLE_CACHE` flag.

---

## Target Architecture

```
/content/                     File system
    ↓
src/content.config.ts         Collection definitions + inline loaders + exported types
    ↓  (Astro content store, digest-based caching)
/src/pages/*.astro            getCollection() → pass arrays to getProps
    ↓
/src/features/*/getProps.ts   Accept collection data, call pure API functions
    ↓
/src/api/*.ts                 Pure transform functions (no I/O)
```

Astro pages become the sole callers of `getCollection()`. They extract `.data` from each
entry and pass typed arrays down to `getProps` functions, which pass them to API functions.
No API or feature function calls `getCollection()` internally.

---

## Collections

Eight collections replace the eight data-layer files. All are defined in
`src/content.config.ts` using custom inline loaders (per lessons learned from the
`frankshowalter.com` migration). Loaders must call `ctx.parseData()` before `store.set()`
so Zod transforms (e.g. `z.coerce.date()`) run at load time.

### `authors`

| Property | Value |
|----------|-------|
| Source   | `/content/data/authors/*.json` (one file per author) |
| Loader   | Custom: glob directory, read + parse each file |
| ID       | Author slug (from JSON `slug` field) |
| Replaces | `authors-json.ts` → `allAuthorsJson()` |

Schema mirrors the existing `AuthorJson` Zod schema (name, sortName, slug, reviewedWorks
array with nested work metadata).

### `reviewedWorks`

| Property | Value |
|----------|-------|
| Source   | `/content/data/reviewed-works.json` (array) |
| Loader   | Custom: read file, iterate array items |
| ID       | Work slug |
| Replaces | `reviewed-works-json.ts` → `allReviewedWorksJson()` |

Schema mirrors `ReviewedWorkJson` (readings array with `z.coerce.date()` on date fields,
authors, includedWorks, moreByAuthors, moreReviews).

### `readingEntries`

| Property | Value |
|----------|-------|
| Source   | `/content/data/reading-entries.json` (array) |
| Loader   | Custom: read file, iterate array items |
| ID       | `String(readingEntrySequence)` |
| Replaces | `reading-entries-json.ts` → `allReadingEntriesJson()` |

Schema mirrors `ReadingEntryJson` (readingEntrySequence, slug, edition, kind, progress,
reviewed, workYear, title, authors array).

### `reviews`

| Property | Value |
|----------|-------|
| Source   | `/content/reviews/*.md` (gray-matter frontmatter + body) |
| Loader   | Custom: glob directory, parse frontmatter + pre-compute HTML |
| ID       | Slug derived from filename (strip leading date prefix) |
| Replaces | `reviews-markdown.ts` → `allReviewsMarkdown()` |

Schema: frontmatter fields (work_slug, grade, date via `z.coerce.date()`, optional
synopsis), `body` (raw markdown), `intermediateHtml` (remark/rehype output with
`<span data-work-slug="">` spans still intact — `linkReviewedWorks` not yet applied),
and `excerptHtml` (fully processed excerpt HTML — synposis or first paragraph, no
`linkReviewedWorks` needed for excerpts). See _Markdown Processing Strategy_ below.

### `readings`

| Property | Value |
|----------|-------|
| Source   | `/content/readings/*.md` (gray-matter frontmatter + body) |
| Loader   | Custom: glob directory, parse frontmatter + pre-compute HTML |
| ID       | Slug derived from filename |
| Replaces | `readings-markdown.ts` → `allReadingsMarkdown()` |

Schema: frontmatter fields (work_slug, sequence, edition, nullable edition_notes, timeline
array of `{date, progress}`), `body` (raw markdown reading notes),
`intermediateReadingNotesHtml` (body processed through remark/rehype, spans intact), and
`intermediateEditionNotesHtml` (edition_notes processed as inline span HTML, spans intact).
See _Markdown Processing Strategy_ below.

### `pages`

| Property | Value |
|----------|-------|
| Source   | `/content/pages/*.md` (gray-matter frontmatter + body) |
| Loader   | Custom: glob directory, parse frontmatter + pre-compute HTML |
| ID       | Page slug (from frontmatter) |
| Replaces | `pages-markdown.ts` → `allPagesMarkdown()` |

Schema: frontmatter fields (slug, title), `body` (raw markdown), and `intermediateHtml`
(remark/rehype output with `<span data-work-slug="">` spans still intact).

---

## Markdown Processing Strategy

### Why `ctx.renderMarkdown` is not used

`ctx.renderMarkdown()` renders markdown using Astro's configured remark pipeline. This
codebase uses a custom pipeline with `remark-smartypants`, a specific `footnoteBackContent`
option on `remarkRehype`, and several custom plugins (`removeFootnotes`, `trimToExcerpt`,
`rootAsSpan`). These cannot be passed to `ctx.renderMarkdown`, so the loaders run the
existing `getHtml` / `getHtmlAsSpan` utilities directly.

### The cross-collection dependency problem

`linkReviewedWorks` converts `<span data-work-slug="slug">text</span>` elements to
`<a href="/reviews/slug/">text</a>` links, but only if a review exists for that slug. This
means the final HTML for any markdown document depends on the set of reviewed works. If a
new review is added, previously-unlinked spans in other documents must now become links.

Storing the fully-linked final HTML in the content store would require invalidating all
markdown entries whenever the `reviewedWorks` collection changes — negating the caching
benefit.

### Two-phase approach

**Phase 1 — in the content loader**: Run the full remark/rehype pipeline but skip
`linkReviewedWorks`. Store the resulting "intermediate HTML" (with `<span
data-work-slug="">` elements intact) in the content store entry's `data` field.

**Phase 2 — in the API layer at build time**: The API functions call `linkReviewedWorks`
against the stored intermediate HTML, passing the current `ReviewedWorkData[]` array. The
linking is cheap (a regex pass), runs on every build, and always reflects the current set
of reviewed works.

```
Loader (cached):   raw markdown → remark/rehype → intermediateHtml  (stored in store)
API (every build): intermediateHtml + reviewedWorks → linkReviewedWorks → finalHtml
```

### Consequences

- Adding a new review does **not** invalidate existing content store entries
- The expensive remark/rehype step only re-runs when the source markdown changes
- `linkReviewedWorks` always runs fresh with the current reviewed works list
- Excerpts (synopsis or first paragraph) do **not** go through `linkReviewedWorks` and
  are stored fully-processed in the store

### Digest strategy for markdown collections

Digest the **raw content** (frontmatter + body) before processing. Use the digest to
short-circuit the expensive remark/rehype step when nothing has changed:

```typescript
for (const { id, frontmatter, body } of markdownFiles) {
  const digest = ctx.generateDigest({ body, frontmatter });

  // Skip expensive re-processing if content unchanged
  if (store.has(id) && store.get(id)?.digest === digest) {
    continue;
  }

  // Only run remark/rehype when content changed
  const intermediateHtml = runCustomRemarkPipeline(body);
  const excerptHtml = runExcerptPipeline(frontmatter.synopsis ?? body);

  const data = await ctx.parseData({
    data: { ...frontmatter, body, excerptHtml, intermediateHtml },
    id,
  });
  store.set({ data, digest, id });
}
```

Digesting raw content means a change to the remark configuration (plugin update,
custom plugin change) would require manually deleting `.astro/data-store.json` to force
a rebuild. This is an acceptable trade-off — remark config changes are rare, and the
manual step is documented.

### `alltimeStats`

| Property | Value |
|----------|-------|
| Source   | `/content/data/all-time-stats.json` (single object) |
| Loader   | Custom: read single file, store as one entry |
| ID       | `"alltime"` (fixed) |
| Replaces | `alltime-stats-json.ts` → `alltimeStatsJson()` |

Schema mirrors `AlltimeStatsJson` (bookCount, reviewCount, workCount, grade/kind/decade/
edition distributions, mostReadAuthors with nested readings).

### `yearStats`

| Property | Value |
|----------|-------|
| Source   | `/content/data/year-stats/*.json` (one file per year) |
| Loader   | Custom: glob directory, read + parse each file |
| ID       | Year string (e.g. `"2024"`) |
| Replaces | `year-stats-json.ts` → `allYearStatsJson()` |

Schema mirrors `YearStatsJson` (year, bookCount, workCount, distributions,
mostReadAuthors).

---

## Exported Types

`src/content.config.ts` exports `z.infer<>` types for all collection schemas. These are
the single source of truth for typed fixture data in tests and typed parameters in API
and props functions:

```typescript
export type AuthorData = z.infer<typeof AuthorSchema>;
export type ReviewedWorkData = z.infer<typeof ReviewedWorkSchema>;
export type ReadingEntryData = z.infer<typeof ReadingEntrySchema>;
export type ReviewData = z.infer<typeof ReviewSchema>;
export type ReadingData = z.infer<typeof ReadingSchema>;
export type PageData = z.infer<typeof PageSchema>;
export type AlltimeStatData = z.infer<typeof AlltimeStatSchema>;
export type YearStatData = z.infer<typeof YearStatSchema>;
```

---

## API Function Signature Changes

All five API files change from internal async data fetchers to pure (or async-for-HTML)
transform functions. The `ENABLE_CACHE` flag and all module-level cache `Map`s are removed.

### `authors.ts`

```typescript
// Before
export async function allAuthors(): Promise<Author[]>
export async function getAuthorDetails(slug: string): Promise<AuthorDetails | undefined>

// After
export function allAuthors(authors: AuthorData[]): Author[]
export function getAuthorDetails(slug: string, authors: AuthorData[]): AuthorDetails | undefined
```

### `pages.ts`

```typescript
// Before
export async function getPage(slug: string): Promise<Page | undefined>

// After — now synchronous; remark/rehype is done in the loader
export function getPage(
  slug: string,
  pages: PageData[],
  reviewedWorks: ReviewedWorkData[],
): Page | undefined
// Applies linkReviewedWorks(page.intermediateHtml, reviewedWorks) at call time
```

`getContentPlainText` remains a pure utility — signature unchanged.

Note: `pages` callers now also need the `reviewedWorks` collection because `linkReviewedWorks`
requires the live set of reviewed slugs. Astro pages using `getPage` must call both
`getCollection('pages')` and `getCollection('reviewedWorks')`.

### `readings.ts`

```typescript
// Before
export async function allReadingEntries(): Promise<ReadingEntries>

// After
export function allReadingEntries(entries: ReadingEntryData[]): ReadingEntries
```

Internal filtering and aggregation logic is unchanged; only the data source changes.

### `reviews.ts`

```typescript
// Before
export async function allReviews(): Promise<ReviewsResult>
export async function loadContent(review: Review): Promise<ReviewContent>
export async function loadExcerptHtml(review: Review): Promise<string>
export async function mostRecentReviews(limit: number): Promise<Review[]>

// After — all become synchronous; remark/rehype is done in the loaders
export function allReviews(
  works: ReviewedWorkData[],
  reviews: ReviewData[],
): ReviewsResult
// Note: `readings` removed — reading notes aren't loaded by allReviews (only by loadContent)

export function loadContent(
  review: Review,
  readings: ReadingData[],
  reviewedWorks: ReviewedWorkData[],
): ReviewContent
// Applies linkReviewedWorks to review.intermediateHtml and to reading/edition note HTML

export function loadExcerptHtml(review: ReviewData): string
// Returns review.excerptHtml directly — pre-computed in loader, no processing needed

export function mostRecentReviews(reviews: Review[], limit: number): Review[]
```

`loadContent` and `loadExcerptHtml` become synchronous because the expensive remark/rehype
work is pre-computed in the loaders. `loadContent` still calls `linkReviewedWorks` against
`review.intermediateHtml`, `reading.intermediateReadingNotesHtml`, and
`reading.intermediateEditionNotesHtml` using the passed-in `reviewedWorks` array.

### `stats.ts`

```typescript
// Before
export async function allStatYears(): Promise<number[]>
export async function alltimeStats(): Promise<AlltimeStats>
export async function statsForYear(year: number): Promise<YearStats | undefined>

// After
export function allStatYears(yearStats: YearStatData[]): number[]
export function alltimeStats(data: AlltimeStatData): AlltimeStats
export function statsForYear(year: number, yearStats: YearStatData[]): YearStats | undefined
```

---

## Astro Page Changes

Each Astro page calls `getCollection()`, maps `.data` off the entries, and passes typed
arrays into `getProps` functions. Example pattern for the reviews listing page:

```astro
---
import { getCollection } from 'astro:content';
import { getReviewsProps } from '~/features/reviews/getReviewsProps';

const works = (await getCollection('reviewedWorks')).map((e) => e.data);
const reviews = (await getCollection('reviews')).map((e) => e.data);
const props = getReviewsProps(works, reviews);
// Note: readings not needed for the listing — only loadContent (individual review page) needs them
---
```

For an individual review page (which calls `loadContent`):

```astro
---
const works = (await getCollection('reviewedWorks')).map((e) => e.data);
const reviews = (await getCollection('reviews')).map((e) => e.data);
const readings = (await getCollection('readings')).map((e) => e.data);
const props = getReviewProps(slug, works, reviews, readings);
---
```

For a page that uses `getPage` (e.g. `/how-i-grade`):

```astro
---
const pages = (await getCollection('pages')).map((e) => e.data);
const works = (await getCollection('reviewedWorks')).map((e) => e.data);
const page = getPage('how-i-grade', pages, works);
---
```

### `getProps` function signature changes

Each `getProps` function in `/src/features/` grows corresponding parameters that are
threaded through to the API functions. Example:

```typescript
// Before
export async function getReviewsProps(): Promise<ReviewsProps>

// After — sync, since API functions are now sync
export function getReviewsProps(
  works: ReviewedWorkData[],
  reviews: ReviewData[],
): ReviewsProps
```

---

## Files Deleted After Migration

| File | Replaced by |
|------|-------------|
| `src/api/data/authors-json.ts` | `authors` collection |
| `src/api/data/reviewed-works-json.ts` | `reviewedWorks` collection |
| `src/api/data/reading-entries-json.ts` | `readingEntries` collection |
| `src/api/data/reviews-markdown.ts` | `reviews` collection |
| `src/api/data/readings-markdown.ts` | `readings` collection |
| `src/api/data/pages-markdown.ts` | `pages` collection |
| `src/api/data/alltime-stats-json.ts` | `alltimeStats` collection |
| `src/api/data/year-stats-json.ts` | `yearStats` collection |
| `src/api/data/utils/getContentPath.ts` | No longer needed |
| `src/api/data/utils/ENABLE_CACHE.ts` | Replaced by content store caching |

The `src/api/data/` directory is removed entirely.

The custom `contentHmr()` Vite plugin in `astro.config.ts` is removed; Astro content
collections register their own file watchers (via the `watcher` parameter in loader
`load()` functions).

---

## Testing Strategy

### Snapshot tests are deleted as part of this migration

Snapshot tests (Astro page-level and page component-level) are removed during the
migration — not migrated. They were designed to catch regressions caused by dependency
updates and unintended side-effects, but the architecture change makes them impractical:
`getCollection()` returns empty arrays in Vitest, so any snapshot that rendered a page
with real data would now render an empty shell.

The only tests retained are **interactive component tests** for filtering and sorting —
the reducers, filter UIs, and sort UIs that have client-side state. These test behaviour
that cannot be observed from a static snapshot and continue to work fine with typed
fixtures.

### What each stage deletes

Each stage that migrates an API file also deletes the snapshot tests associated with
that domain (Astro-level and component-level). The vitest projects that housed only
snapshot tests (`pages-node`, `astro-node`) may become empty and should be removed from
`vitest.config.ts` once all their tests are gone.

### What is kept

- Pure API function tests that call the newly pure functions with typed fixtures
- Interactive component tests for filter/sort reducers and UIs
- Any other behavioural tests that exercise user-visible interactions

### Fixture pattern

```typescript
// src/features/reviews/__fixtures__/reviews.ts
import type { ReviewData } from '~/content.config';

export const reviewFixtures: ReviewData[] = [
  {
    slug: 'dark-crusade-by-karl-edward-wagner',
    work_slug: 'dark-crusade-by-karl-edward-wagner',
    grade: 'A',
    date: new Date('2012-05-18'),
    synopsis: undefined,
    body: 'A tightly plotted...',
    excerptHtml: '<p>A tightly plotted...</p>',
    intermediateHtml: '<p>See also <span data-work-slug="example">Example</span>.</p>',
  },
];
```

### Test project updates

- Remove `setupFiles` reference for `setupTestCache` from `api-node` (cache is gone).
- Remove `pages-node` and `astro-node` vitest projects once their snapshot tests are
  deleted — keeping empty projects produces no value and misleads coverage reports.

---

## Key Risks

| Risk | Mitigation |
|------|------------|
| `reviews.ts` merges multiple data sources; threading through call chain is broad | Migrate reviews last; confirm all collections work first |
| Many Astro pages and getProps files need signature updates | Mechanical but high-count; TypeScript errors guide the work |
| `getCollection()` returns empty in Vitest | Make all API functions pure before migrating tests |
| Intermediate HTML in fixtures is verbose | Use a small subset of real content; the `<span>` elements are explicit and readable |
| Remark config change doesn't invalidate digest (raw digest strategy) | Document that `.astro/data-store.json` must be deleted after remark pipeline changes |
| `pages` callers now also need `reviewedWorks` collection | Thread `reviewedWorks` through `getPage` callers; small scope expansion |
| `contentHmr()` removal breaks dev HMR | Verify Astro's watcher registration in loaders before removing plugin |
| Loader lint rules (`perfectionist/sort-objects`, `unbound-method`) | Follow lessons learned: call via `ctx.method()`, keep object keys sorted |

---

## Loader Implementation Notes

### Always call `ctx.parseData()` before `store.set()`

Zod transforms (including `z.coerce.date()`) only run if `parseData` is called. Skipping
it means date fields arrive as strings at runtime despite TypeScript typing them as `Date`.

### Do not destructure ctx methods

`ctx.parseData` and `ctx.generateDigest` trigger `@typescript-eslint/unbound-method`.
Call them as `ctx.parseData(...)` and `ctx.generateDigest(...)`.

### Digest strategy

**JSON-only collections** (authors, readingEntries, stats, reviewedWorks): digest the raw
item. Transforms are pure type coercions (`z.coerce.date()`); semantic content is unchanged.

```typescript
const data = await ctx.parseData({ data: item, id: item.slug });
store.set({ data, digest: ctx.generateDigest(item), id: item.slug });
```

**Markdown collections** (reviews, readings, pages): digest the raw content (frontmatter +
body) and use it to **skip re-processing** if unchanged. See the full pattern in the
_Markdown Processing Strategy_ section above. Digesting raw content means remark pipeline
changes require a manual `rm .astro/data-store.json` — document this for future maintainers.

### Selective removal over `store.clear()`

```typescript
const newIds = new Set(raw.map((item) => item.slug));
for (const id of store.keys()) {
  if (!newIds.has(id)) store.delete(id);
}
```

### Register file watchers for HMR

```typescript
watcher?.add(filePath);
watcher?.on('change', (changedPath) => {
  if (changedPath === filePath) void sync();
});
```

### Delete `.astro/data-store.json` after fixing loader bugs

Stale cached data from a broken loader persists in `.astro/data-store.json`. Delete the
file after any loader fix so the store rebuilds from scratch.
