# Content Collections Migration: Implementation Plan

See `SPEC.md` for the full design rationale, collection definitions, and risk analysis.

---

## Stage 1: Create `content.config.ts` with all collections

**Goal**: Define all eight collections with inline loaders and Zod schemas. Verify that
`getCollection()` returns correctly typed, fully validated data. No changes to existing
API or feature code.

**Status**: Complete

### Work

1. Create `src/content.config.ts` with all eight collections:
   - `authors` — custom loader: glob `/content/data/authors/*.json`
   - `reviewedWorks` — custom loader: read `/content/data/reviewed-works.json`, iterate
   - `readingEntries` — custom loader: read `/content/data/reading-entries.json`, iterate
   - `reviews` — custom loader: glob `/content/reviews/*.md`, parse with gray-matter
   - `readings` — custom loader: glob `/content/readings/*.md`, parse with gray-matter
   - `pages` — custom loader: glob `/content/pages/*.md`, parse with gray-matter
   - `alltimeStats` — custom loader: read `/content/data/all-time-stats.json` as single
     entry with id `"alltime"`
   - `yearStats` — custom loader: glob `/content/data/year-stats/*.json`

2. For **JSON-only collections** (`authors`, `reviewedWorks`, `readingEntries`,
   `alltimeStats`, `yearStats`), implement the standard pattern, with the collection
   reference transformations applied before `parseData()`:

   **`authors` loader** — extract work slugs from embedded objects:

   ```typescript
   const data = await ctx.parseData({
     id: author.slug,
     data: {
       ...author,
       reviewedWorks: author.reviewedWorks.map((w) => w.slug),
     },
   });
   store.set({ data, digest: ctx.generateDigest(author), id: author.slug });
   ```

   **`reviewedWorks` loader** — extract slugs from `moreReviews` and
   `moreByAuthors[].reviewedWorks`:

   ```typescript
   const data = await ctx.parseData({
     id: work.slug,
     data: {
       ...work,
       moreByAuthors: work.moreByAuthors.map((a) => ({
         ...a,
         reviewedWorks: a.reviewedWorks.map((w) => w.slug),
       })),
       moreReviews: work.moreReviews.map((r) => r.slug),
     },
   });
   store.set({ data, digest: ctx.generateDigest(work), id: work.slug });
   ```

   **`readingEntries`, `alltimeStats`, `yearStats` loaders** — no reference fields;
   use the plain pattern:

   ```typescript
   const data = await ctx.parseData({ data: item, id: item.slug });
   store.set({ data, digest: ctx.generateDigest(item), id: item.slug });
   ```

   For **markdown collections** (`reviews`, `readings`, `pages`), use the two-phase
   approach — digest raw content to short-circuit processing, then store pre-computed
   intermediate HTML (remark/rehype done; `linkReviewedWorks` NOT applied yet). The
   `work_slug` field is already a plain string in frontmatter; `parseData()` handles
   the `reference('reviewedWorks')` coercion automatically:

   ```typescript
   for (const { id, frontmatter, body } of markdownFiles) {
     const digest = ctx.generateDigest({ body, frontmatter });

     // Skip expensive re-processing if content unchanged
     if (store.has(id) && store.get(id)?.digest === digest) {
       continue;
     }

     // Run remark/rehype WITHOUT linkReviewedWorks
     const intermediateHtml = runCustomPipeline(body);
     // Excerpt: synopsis or first paragraph, fully processed (no linking needed)
     const excerptHtml = runExcerptPipeline(frontmatter.synopsis ?? body);

     const data = await ctx.parseData({
       data: { ...frontmatter, body, excerptHtml, intermediateHtml },
       id,
     });
     store.set({ data, digest, id });
   }
   ```

   See SPEC.md "Markdown Processing Strategy" for the full rationale.

3. Register file watchers in each loader for HMR.

4. Export all `z.infer<>` types from `src/content.config.ts`:
   `AuthorData`, `ReviewedWorkData`, `ReadingEntryData`, `ReviewData`, `ReadingData`,
   `PageData`, `AlltimeStatData`, `YearStatData`.

5. Run `npm run dev` and verify each collection loads. Check the Astro dev toolbar or
   add a temporary `getCollection` call in a page to inspect results.

6. Run `npm run build` to confirm the content store populates without errors.

### Success Criteria

- [x] `npm run dev` starts without errors
- [x] `npm run build` completes without errors
- [x] `getCollection('authors')` returns all authors with correct types
- [x] `getCollection('authors')` entries have `reviewedWorks` as `{ collection, id }[]`
      objects (not embedded work objects) — confirms reference transformation ran in the loader
- [x] `getCollection('reviewedWorks')` returns works with `Date` objects (not strings) on
      date fields — confirms `parseData()` is running
- [x] `getCollection('reviewedWorks')` entries have `moreReviews` as `{ collection, id }[]`
      objects — confirms reference transformation ran in the loader
- [x] `getCollection('reviews')` entries have `work_slug` as a `{ collection, id }` object
- [x] `getCollection('reviews')` returns entries with `body`, `intermediateHtml`, and
      `excerptHtml` all populated — confirms markdown processing ran in the loader
- [x] `getCollection('reviews')` entries have `<span data-work-slug="">` elements in
      `intermediateHtml` (not `<a>` tags) — confirms `linkReviewedWorks` was NOT applied
- [x] All other collections return non-empty results
- [x] No lint errors: `npm run lint`
- [x] No type errors: `npm run check`

### Tests

No new tests in this stage. Existing tests must continue to pass (no existing code
changes). Snapshot tests will be deleted in their respective domain stages (2–6).

---

## Stage 2: Migrate `pages.ts`

**Goal**: Replace `allPagesMarkdown()` with the `pages` collection. Make `getPage()`
accept collection data as a parameter. Update the Astro pages that use it. Delete
`pages-markdown.ts`.

**Status**: Complete

### Work

1. **Update `src/api/pages.ts`**:
   - Change signature to `getPage(slug, pages: PageData[], reviewedWorks: ReviewedWorkData[])`.
   - Remove `async` — remark/rehype is now done in the loader.
   - Replace the internal `allPagesMarkdown()` call + remark pipeline with:
     ```typescript
     const page = pages.find((p) => p.slug === slug);
     if (!page) return undefined;
     return {
       ...page,
       content: linkReviewedWorks(page.intermediateHtml, reviewedWorks),
     };
     ```
   - Remove imports of `allPagesMarkdown`, `getHtml`, `ENABLE_CACHE`.
   - `getContentPlainText` utility remains unchanged.

2. **Update callers of `getPage`** — find with:

   ```
   grep -r "getPage(" src/
   ```

   For each `getProps` function that calls `getPage`:
   - Add `pages: PageData[]` and `reviewedWorks: ReviewedWorkData[]` parameters.
   - Pass both through to `getPage(slug, pages, reviewedWorks)`.

3. **Update Astro pages** that call the affected `getProps`:
   - Add both collections:
     ```astro
     const pages = (await getCollection('pages')).map((e) => e.data); const
     works = (await getCollection('reviewedWorks')).map((e) => e.data);
     ```
   - Pass both to `getProps`.

4. **Delete snapshot tests** for the pages domain and **add pure function tests**:
   - Delete all snapshot tests for pages (Astro-level and component-level).
   - Create `src/api/__fixtures__/pages.ts` with `PageData[]` fixtures. Each fixture must
     include `intermediateHtml` with at least one `<span data-work-slug="">` element to
     verify linking. Use slugs from real `/content/pages/` files.
   - Create or reuse `ReviewedWorkData[]` fixtures for the `reviewedWorks` parameter.
   - Write tests that call `getPage(slug, pageFixtures, worksFixtures)` directly and
     assert that known work spans become `<a>` tags in the output.

5. **Delete** `src/api/data/pages-markdown.ts`.

6. Run `npm run check`, `npm run lint`, `npm run test`.

### Success Criteria

- [x] `getPage('how-i-grade', pageFixtures, worksFixtures)` returns correct HTML in tests
- [x] Work spans in `intermediateHtml` are linked when the slug is in `worksFixtures`
- [x] `/how-i-grade` and any other pages-based routes render correctly in dev
- [x] `pages-markdown.ts` deleted
- [x] No references to `allPagesMarkdown` remain (`grep -r "allPagesMarkdown" src/`)
- [x] `npm run test`, `npm run lint`, `npm run check` pass

---

## Stage 3: Migrate `readings.ts`

**Goal**: Replace `allReadingEntriesJson()` with the `readingEntries` collection. Make
`allReadingEntries()` a pure synchronous function. Update the reading-log feature and its
Astro page. Delete `reading-entries-json.ts`.

**Status**: Not Started

### Work

1. **Update `src/api/readings.ts`**:
   - Change signature: `allReadingEntries(entries: ReadingEntryData[]): ReadingEntries`
   - Remove `async` (no more I/O or caching).
   - Replace internal `allReadingEntriesJson()` call with the `entries` parameter.
   - Remove `ENABLE_CACHE` import and cache logic.
   - Remove import of `allReadingEntriesJson`.

2. **Update `src/features/reading-log/getReadingLogProps.ts`** (or equivalent):
   - Add `entries: ReadingEntryData[]` parameter.
   - Pass to `allReadingEntries(entries)`.

3. **Update `src/pages/readings/index.astro`**:
   - Add `const entries = (await getCollection('readingEntries')).map((e) => e.data);`
   - Pass to `getReadingLogProps(entries)`.

4. **Delete snapshot tests** for the readings domain and **add pure function tests**:
   - Delete all snapshot tests for the reading-log page (Astro-level and component-level).
   - Create `src/api/__fixtures__/readingEntries.ts` with `ReadingEntryData[]` fixtures.
   - Write tests that call `allReadingEntries(fixtures)` and assert the correct counts,
     distinct values, and aggregated statistics.
   - Keep the interactive filter/sort component tests for the reading-log feature.

5. **Delete** `src/api/data/reading-entries-json.ts`.

6. Run `npm run check`, `npm run lint`, `npm run test`.

### Success Criteria

- [ ] `allReadingEntries(fixtures)` returns correct counts and distinct values in tests
- [ ] `/readings` page renders correctly in dev with real data
- [ ] `reading-entries-json.ts` deleted
- [ ] No references to `allReadingEntriesJson` remain
- [ ] All tests pass

---

## Stage 4: Migrate `stats.ts`

**Goal**: Replace `alltimeStatsJson()` and `allYearStatsJson()` with the `alltimeStats`
and `yearStats` collections. Make all stats functions pure. Update stats features and
Astro pages. Delete both stats data-layer files.

**Status**: Not Started

### Work

1. **Update `src/api/stats.ts`**:
   - `allStatYears(yearStats: YearStatData[]): number[]` — pure, sync
   - `alltimeStats(data: AlltimeStatData): AlltimeStats` — pure, sync
   - `statsForYear(year: number, yearStats: YearStatData[]): YearStats | undefined` —
     pure, sync
   - Remove all `async`, `ENABLE_CACHE`, cache `Map`s, and data-layer imports.

2. **Update `src/features/stats/getStatsProps.ts`** (alltime stats):
   - Add `data: AlltimeStatData` and `yearStats: YearStatData[]` parameters.
   - Thread through to the API functions.

3. **Update `src/features/stats/getYearStatsProps.ts`** (per-year stats):
   - Add `yearStats: YearStatData[]` parameter.
   - Thread through to `statsForYear`.

4. **Update Astro pages**:
   - `src/pages/readings/stats/index.astro`:
     ```astro
     const alltimeEntry = await getCollection('alltimeStats'); const data =
     alltimeEntry[0].data; const yearStatsEntries = (await
     getCollection('yearStats')).map((e) => e.data); const props = await
     getAlltimeStatsProps(data, yearStatsEntries);
     ```
   - `src/pages/readings/stats/[year]/index.astro`:
     ```astro
     const yearStatsEntries = (await getCollection('yearStats')).map((e) =>
     e.data);
     ```
     Update `getStaticPaths` to use `allStatYears(yearStatsEntries)`.

5. **Delete snapshot tests** for the stats domain and **add pure function tests**:
   - Delete all snapshot tests for stats pages (Astro-level and component-level).
   - Create fixtures for `AlltimeStatData` and `YearStatData[]`.
   - Write tests that call `allStatYears`, `alltimeStats`, and `statsForYear` with
     fixtures and assert correct return values.

6. **Delete** `src/api/data/alltime-stats-json.ts` and `src/api/data/year-stats-json.ts`.

7. Run `npm run check`, `npm run lint`, `npm run test`.

### Success Criteria

- [ ] Stats pages render correctly in dev
- [ ] `allStatYears(fixtures)` returns sorted year numbers in tests
- [ ] `statsForYear(2024, fixtures)` returns correct data in tests
- [ ] Both data-layer files deleted
- [ ] All tests pass

---

## Stage 5: Migrate `authors.ts`

**Goal**: Replace `allAuthorsJson()` with the `authors` collection. Make `allAuthors()`
and `getAuthorDetails()` pure. Update author features and Astro pages. Delete
`authors-json.ts`.

**Status**: Not Started

### Work

1. **Update `src/api/authors.ts`**:
   - `allAuthors(authors: AuthorData[]): Author[]` — pure, sync
   - `getAuthorDetails(slug: string, authors: AuthorData[]): AuthorDetails | undefined` —
     pure, sync
   - Remove `async`, `ENABLE_CACHE`, cache `Map`s, and data-layer imports.

2. **Update `src/features/authors/getAuthorsProps.ts`**:
   - Add `authors: AuthorData[]` parameter.
   - Pass to `allAuthors(authors)`.

3. **Update `src/features/author-titles/getAuthorTitlesProps.ts`**:
   - Add `authors: AuthorData[]` parameter.
   - Pass to `getAuthorDetails(slug, authors)`.

4. **Update Astro pages**:
   - `src/pages/authors/index.astro`:
     ```astro
     const authors = (await getCollection('authors')).map((e) => e.data);
     ```
   - `src/pages/authors/[slug]/index.astro`:
     ```astro
     const authors = (await getCollection('authors')).map((e) => e.data);
     ```
     Also update `getStaticPaths` to use `allAuthors(authors)` for slug generation.

5. **Delete snapshot tests** for the authors domain and **add pure function tests**:
   - Delete all snapshot tests for authors pages (Astro-level and component-level).
   - Create `src/api/__fixtures__/authors.ts` with real author slugs from
     `/content/data/authors/` (verify the slugs exist).
   - Write tests that call `allAuthors(fixtures)` and `getAuthorDetails(slug, fixtures)`.
   - Keep the interactive filter/sort component tests for the authors feature.

6. **Delete** `src/api/data/authors-json.ts`.

7. Run `npm run check`, `npm run lint`, `npm run test`.

### Success Criteria

- [ ] Authors listing page renders in dev
- [ ] Individual author pages render in dev (test a few slugs)
- [ ] `getAuthorDetails('stephen-king', fixtures)` returns correct data in tests
- [ ] `authors-json.ts` deleted
- [ ] `getStaticPaths` on the `[slug]` page uses collection data correctly
- [ ] All tests pass

---

## Stage 6: Migrate `reviews.ts`

**Goal**: Replace the three data sources consumed by `reviews.ts`
(`allReviewedWorksJson()`, `allReviewsMarkdown()`, `allReadingsMarkdown()`) with the
`reviewedWorks`, `reviews`, and `readings` collections. All review API functions become
synchronous (remark/rehype is pre-computed in the loaders; only `linkReviewedWorks`
runs at call time). Update review features and Astro pages. Delete the three data-layer
files.

This is the most complex stage. All three collections must be verified to load correctly
(they were defined in Stage 1) before proceeding.

**Status**: Not Started

### Work

1. **Update `src/api/reviews.ts`** — all four functions become synchronous:

   ```typescript
   // Merge works + reviews collection data; extract distinct filter values
   export function allReviews(
     works: ReviewedWorkData[],
     reviews: ReviewData[],
   ): ReviewsResult;

   // Apply linkReviewedWorks to pre-computed intermediate HTML from store
   export function loadContent(
     review: Review,
     readings: ReadingData[],
     reviewedWorks: ReviewedWorkData[],
   ): ReviewContent;
   // Internally: linkReviewedWorks(review.intermediateHtml, reviewedWorks)
   //             linkReviewedWorks(reading.intermediateReadingNotesHtml, reviewedWorks)
   //             linkReviewedWorks(reading.intermediateEditionNotesHtml, reviewedWorks)

   // Return pre-computed excerpt from store — no processing needed
   export function loadExcerptHtml(review: ReviewData): string;
   // return review.excerptHtml

   export function mostRecentReviews(
     reviews: Review[],
     limit: number,
   ): Review[];
   ```

   Remove all `async` keywords, `ENABLE_CACHE`, the excerpt cache `Map`, and all
   data-layer imports. Remove `getHtml`, `getHtmlAsSpan`, `remark`, `rehype*` imports
   — the remark pipeline no longer runs in `reviews.ts`.

2. **Update `src/features/reviews/getReviewsProps.ts`**:
   - New signature: `getReviewsProps(works: ReviewedWorkData[], reviews: ReviewData[])`
   - Note: `readings` is NOT needed for the listing page.
   - Pass through to `allReviews(works, reviews)`.
   - Function becomes sync (or stays async if image optimization is async — cover props).

3. **Update `src/features/review/getReviewProps.ts`** (individual review page):
   - Add `works: ReviewedWorkData[]`, `reviews: ReviewData[]`,
     `readings: ReadingData[]` parameters.
   - Pass all three to `loadContent(review, readings, works)`.

4. **Update `src/features/home/getHomeProps.ts`** (uses `mostRecentReviews`):
   - Add `works: ReviewedWorkData[]` and `reviews: ReviewData[]` parameters.
   - Pass to `mostRecentReviews` after building `Review[]` from `allReviews`.

5. **Update all Astro pages** that consume review data:

   Reviews listing (`src/pages/reviews/index.astro`):

   ```astro
   const works = (await getCollection('reviewedWorks')).map((e) => e.data);
   const reviews = (await getCollection('reviews')).map((e) => e.data); const
   props = getReviewsProps(works, reviews);
   ```

   Individual review (`src/pages/reviews/[slug]/index.astro`):

   ```astro
   const works = (await getCollection('reviewedWorks')).map((e) => e.data);
   const reviews = (await getCollection('reviews')).map((e) => e.data); const
   readings = (await getCollection('readings')).map((e) => e.data); //
   getStaticPaths: use works array to generate slugs
   ```

   Homepage (`src/pages/index.astro`):

   ```astro
   const works = (await getCollection('reviewedWorks')).map((e) => e.data);
   const reviews = (await getCollection('reviews')).map((e) => e.data);
   ```

6. **Delete snapshot tests** for the reviews domain and **add pure function and interactive tests**:
   - Delete all snapshot tests for review pages and the homepage (Astro-level and
     component-level).
   - Create `ReviewedWorkData[]`, `ReviewData[]`, and `ReadingData[]` fixtures.
   - `ReviewData` fixtures must include `intermediateHtml` and `excerptHtml`. Use minimal
     HTML with `<span data-work-slug="">` elements to verify linking behaviour.
   - `ReadingData` fixtures must include `intermediateReadingNotesHtml` and
     `intermediateEditionNotesHtml`.
   - Use slugs that correspond to real cover asset files (lesson 11).
   - Write tests asserting `loadContent` correctly links spans to `<a>` tags.
   - Keep the interactive filter/sort component tests for the reviews feature.

7. **Delete**:
   - `src/api/data/reviewed-works-json.ts`
   - `src/api/data/reviews-markdown.ts`
   - `src/api/data/readings-markdown.ts`

8. Run `npm run check`, `npm run lint`, `npm run test`.

### Success Criteria

- [ ] Reviews listing page renders in dev (check multiple filters work)
- [ ] Individual review pages render in dev — work span links appear correctly
- [ ] Homepage renders with most recent reviews in dev
- [ ] `allReviews(worksFixtures, reviewsFixtures)` returns correct data in tests
- [ ] `loadContent(review, readingsFixtures, worksFixtures)` links spans correctly in tests
- [ ] `loadExcerptHtml(reviewFixture)` returns `reviewFixture.excerptHtml` directly
- [ ] Three data-layer files deleted
- [ ] No remark/rehype imports remain in `reviews.ts`
- [ ] All tests pass

---

## Stage 7: Cleanup

**Goal**: Remove all remaining data-layer infrastructure, clean up test configuration,
remove the `contentHmr()` Vite plugin, and verify a clean production build.

**Status**: Not Started

### Work

1. **Delete `src/api/data/utils/getContentPath.ts`** (no longer called anywhere).

2. **Delete `src/api/data/utils/ENABLE_CACHE.ts`** (no longer called anywhere).

3. **Remove `src/api/data/` directory** entirely if now empty. Verify with:

   ```
   ls src/api/data/
   ```

4. **Update `vitest.config.ts`**:
   - Remove `coverage.exclude` entry for `src/api/data/utils/getContentPath.ts`.
   - Remove `setupFiles` references to `setupTestCache` from any test projects that used
     it (check `api-node` and `utils-node` projects).
   - Remove any `setupTests.ts` mocks for `getContentPath` if that file exists.
   - Remove the `pages-node` and `astro-node` test projects if they are now empty (all
     their snapshot tests were deleted in stages 2–6). Keeping empty projects misleads
     coverage reports.

5. **Delete `setupTestCache.ts`** if it exists and is now unused.

6. **Remove `contentHmr()` from `astro.config.ts`**:
   - First, verify in dev that content changes trigger a reload via the loader's `watcher`
     registration (from Stage 1).
   - Then delete the plugin import and usage.
   - Delete the plugin's source file.

7. **Check for any remaining references to deleted data-layer functions**:

   ```
   grep -r "allAuthorsJson\|allReviewedWorksJson\|allReadingEntriesJson\|allReviewsMarkdown\|allReadingsMarkdown\|allPagesMarkdown\|alltimeStatsJson\|allYearStatsJson\|getContentPath\|ENABLE_CACHE" src/
   ```

   There should be zero results.

8. **Run the full pre-PR checklist**:

   ```
   npm run test -- --max-workers=2
   npm run lint
   npm run lint:spelling
   npm run check
   npm run knip
   npm run format
   npm run build
   ```

9. **Delete `.astro/data-store.json`** before the production build to ensure the store
   rebuilds cleanly:
   ```
   rm -f .astro/data-store.json && npm run build
   ```

### Success Criteria

- [ ] `src/api/data/` directory does not exist
- [ ] Zero grep hits for any deleted function names
- [ ] `contentHmr()` removed from `astro.config.ts`
- [ ] Content file changes trigger dev server reload without `contentHmr()`
- [ ] `npm run test` passes (max-workers=2)
- [ ] `npm run lint` passes with no warnings
- [ ] `npm run lint:spelling` passes
- [ ] `npm run check` passes with no type errors
- [ ] `npm run knip` passes (no unused exports or dead dependencies)
- [ ] `npm run format` passes
- [ ] `npm run build` produces a complete site

---

## Dependency Order

```
Stage 1 (content.config.ts)
    ↓
Stage 2 (pages)    Stage 3 (readings)    Stage 4 (stats)    Stage 5 (authors)
         \_______________↓___________________↓___________________↓______________/
                                        Stage 6 (reviews)
                                             ↓
                                        Stage 7 (cleanup)
```

Stages 2–5 are independent of each other and can be done in any order (or in parallel
on separate worktrees). Stage 6 must follow Stage 1 (collections already defined). Stage
7 must follow all prior stages.

---

## AIDEV-NOTE: Key Gotchas to Watch

- Always call `ctx.parseData()` before `store.set()` — missing this means Zod transforms
  never run and date fields arrive as strings at runtime despite TypeScript saying `Date`
- Call `ctx.parseData` and `ctx.generateDigest` via `ctx.` — destructuring triggers
  `@typescript-eslint/unbound-method` lint error
- **Markdown loaders digest raw content (not parsed data)** — this enables the
  skip-if-unchanged optimization; remark config changes require a manual
  `rm .astro/data-store.json`
- **`ctx.renderMarkdown` is NOT used** — this codebase has a custom remark pipeline
  (`remark-smartypants`, custom footnote back-content, custom plugins) that `ctx.renderMarkdown`
  cannot accommodate; run the custom pipeline directly in the loader
- **`linkReviewedWorks` is NOT run in loaders** — it must run at build time in the API
  layer with the live `reviewedWorks` collection data; loaders store intermediate HTML
  with `<span data-work-slug="">` spans intact
- `getCollection()` returns `[]` in Vitest — pure API functions are the only testable path
- Delete `.astro/data-store.json` after any loader bug fix to clear stale cached data
- Object literal keys in `content.config.ts` must be alphabetically sorted
  (`perfectionist/sort-objects` rule)
- Fixture slugs must have matching cover asset files in `/content/assets/covers/`
- **Strip embedded objects to ID strings before `ctx.parseData()` for `reference()` fields** —
  the source JSON embeds full objects (e.g. `author.reviewedWorks` is an array of work
  objects); the loader must map these to slug strings before passing to `parseData()`,
  otherwise Zod rejects the unexpected shape
- **`reference()` validates IDs at build time** — every slug passed to a `reference()` field
  must exist in the target collection; data integrity issues (orphaned slugs) will cause
  build errors; do NOT use `reference('reviewedWorks')` for `includedWorks` since some
  entries are unreviewed
- **API functions resolve references by ID lookup** — after `parseData()`, reference fields
  are `{ collection, id }` objects; join against the typed array already passed as a
  parameter (e.g. `works.find((w) => w.slug === ref.id)`); never call `getEntry()` from
  API functions
