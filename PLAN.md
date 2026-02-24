# Plan: Content Data Restructuring

See `spec.md` for full rationale, field derivation details, and downstream change lists.

---

## Stage 1: Rename fields in `readings` and `reviews`; update stats schemas

**Goal**: Update schemas, loaders, and all downstream consumers for the frontmatter
key renames in `readings/*.md` and `reviews/*.md`. Remove `MostReadAuthorReadingSchema`
and replace with `reference("readings")`. No new collections yet.

**Status**: Complete (see progress.txt for details)

### Work

1. **`src/content.config.ts` — `ReadingSchema`**:
   - Rename `work_slug` → `workSlug` as plain `z.string()` (no longer a `reference()`)
   - Rename `edition_notes` → `editionNotes` (field name and transform block)
   - Add `slug: z.string()` field (the reading's own unique ID = filename stem)
   - Add `date: z.coerce.date()` field
   - Update AIDEV-NOTE comment on the schema

2. **`src/content.config.ts` — `readings` loader `buildData`**:
   - `frontmatter.work_slug` → `frontmatter.workSlug`
   - `frontmatter.edition_notes` → `frontmatter.editionNotes`
   - Add `slug: frontmatter.slug as string`
   - Add `date: frontmatter.date`

3. **`src/content.config.ts` — `ReviewSchema`**:
   - Rename `work_slug` → `slug` (the frontmatter key is now `slug:`)

4. **`src/content.config.ts` — `reviews` loader `buildData`**:
   - `frontmatter.work_slug as string` → `frontmatter.slug as string`
   - Field key in the returned object: `work_slug:` → `slug:`

5. **`src/content.config.ts` — `MostReadAuthorReadingSchema`**:
   - Remove entirely
   - Change `MostReadAuthorSchema.readings` from `z.array(MostReadAuthorReadingSchema)`
     to `z.array(reference("readings"))`

6. **`src/api/reviews.ts`** — update all `work_slug` references:
   - `reviews.find((r) => r.work_slug.id === work.slug)` → `r.slug.id`
   - `readings.find((r) => r.work_slug.id === review.slug)` → `r.workSlug.id`
   - Update AIDEV-NOTEs that reference `work_slug`

7. **`src/features/review/getReviewProps.ts`**:
   - `reviews.find((r) => r.work_slug.id === ref.id)` → `r.slug.id`

8. **`src/features/stats/getStatsProps.ts`** — resolve reading references:
   - Build `readingsMap: Map<string, CollectionEntry<'readings'>>` from
     `getCollection('readings')`
   - In `createMostReadAuthorsListItemValueProps`, resolve each `ref.id` via the map
   - Replace `reading.slug` (was work slug) with `reading.data.workSlug` for cover images
   - Replace `reading.date` with `reading.data.date`

9. **`src/api/__fixtures__/readings.ts`**:
   - `work_slug: { ... }` → `workSlug: "..."` (plain string, not a reference)
   - `edition_notes: undefined` → `editionNotes: undefined`
   - Add `slug: "..."` (the reading's own unique slug)

10. **`src/api/__fixtures__/reviews.ts`**:
    - `work_slug: { ... }` → `slug: { ... }`

11. Delete `.astro/data-store.json` to force a full rebuild.

12. Run `npm run check`, `npm run lint`, `npm run test -- --max-workers=2`.

### Success Criteria

- [ ] `npm run check` passes — no type errors on `workSlug` / `editionNotes` / `slug`
- [ ] `npm run lint` passes
- [ ] `npm run test -- --max-workers=2` passes (update snapshots if needed with `npm run test:update`)
- [ ] `npm run build` succeeds — `readings` and `reviews` collections load; stats pages build
- [ ] Zero `grep` hits for `work_slug` or `edition_notes` in `src/` (excluding comments)
- [ ] `MostReadAuthorReadingSchema` no longer exists in `content.config.ts`

---

## Stage 2: Add `works` and `moreForReviewedWorks` collections; simplify `authors` loader

**Goal**: Add the new `works` and `moreForReviewedWorks` content collections. Simplify
the `authors` loader by removing the `reviewedWorks` field and computation entirely.

**Status**: Complete

### Work

1. **`src/content.config.ts` — add `works` collection**:
   - Simple loader from `data/works/*.json`, entry ID = work slug
   - Schema maps `year` → `workYear`; otherwise fields are direct
   - `includedWorks` is `z.string().array()` (plain slugs, not references)
   - `authors` is `z.object({ slug: z.string(), notes: z.string().nullable() }).array()`

2. **`src/content.config.ts` — add `moreForReviewedWorks` collection**:
   - Simple `loadJsonArrayFile` loader from `data/more-for-reviewed-works.json`
   - Entry ID = `raw.work as string` (the work slug)
   - Schema: `z.object({ moreByAuthors: ..., moreReviews: z.array(z.string()), work: z.string() })`

3. **`src/content.config.ts` — `AuthorSchema`**:
   - Remove `reviewedWorks` field entirely

4. **`src/content.config.ts` — `authors` loader**:
   - Remove all computation — simplify to raw JSON passthrough
   - Digest raw file content only

5. Delete `.astro/data-store.json` before testing.

### Success Criteria

- [ ] `npm run check` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds — `works` and `moreForReviewedWorks` entries load;
      `authors` loads without `reviewedWorks`
- [ ] `getCollection('works')` returns all ~500 works with correct fields
- [ ] `getCollection('authors')` entries no longer have `reviewedWorks`

---

## Stage 3: Replace `reviewedWorks` collection with direct collection joins

**Goal**: Remove the `reviewedWorks` collection. Rewrite each consumer to join
`works`, `reviews`, and `authors` collections directly. Each consumer fetches only
the fields it needs.

**Status**: Complete

### Work

1. **`src/features/reviews/getReviewsProps.ts`**:
   - Replace `getCollection('reviewedWorks')` with `getCollection('works')` +
     `getCollection('reviews')` + `getCollection('authors')`
   - Build maps for O(1) lookup; join inline
   - Compute `gradeValue`, `reviewYear`, `reviewSequence` per the spec formulas

2. **`src/features/author-titles/getAuthorTitlesProps.ts`**:
   - Replace `authors.data.reviewedWorks` reference traversal with:
     filter `getCollection('reviews')` to slugs whose work has this author;
     join with `works` and `authors` collections
   - Same summary shape as `getReviewsProps`

3. **`src/features/review/getReviewProps.ts`** (full shape):
   - `getEntry('works', slug)` + `getEntry('reviews', slug)`
   - Filter `getCollection('readings')` by `workSlug`
   - `getEntry('moreForReviewedWorks', slug)`
   - `getCollection('authors')` for name enrichment
   - `getCollection('works')` for `includedWorks` enrichment and `includedInSlugs`

4. **`src/features/home/getHomeProps.ts`**, **`src/components/article/getArticleProps.ts`**,
   **`src/pages/reviews/[slug]/og.jpg.ts`**, **`src/pages/updates.json.ts`**,
   **`src/pages/feed.xml.ts`** — replace `getCollection('reviewedWorks')` with direct
   collection joins appropriate to each consumer's field needs.

5. **`src/features/authors/getAuthorsProps.ts`**:
   - Replace `reviewedWorks.length` with count derived from `getCollection('reviews')`
     cross-referenced against `works` by author slug

6. **`src/api/reviews.ts`**, **`src/api/authors.ts`**, **`src/api/pages.ts`**,
   **`src/api/utils/linkReviewedWorks.ts`**:
   - Replace any remaining `ReviewedWorkData` usage with joins from constituent
     collections

7. **`src/content.config.ts`** — remove the `reviewedWorks` collection and
   `ReviewedWorkSchema` entirely. Remove `ReviewedWorkData` export.

8. Delete `.astro/data-store.json` before testing.

### Success Criteria

- [ ] `npm run build` succeeds
- [ ] Spot-check in dev: individual review pages render with correct readings, grade,
      moreByAuthors, moreReviews, includedWorks
- [ ] Author pages render correctly
- [ ] Reviews list page renders correctly
- [ ] Zero references to `getCollection('reviewedWorks')` or `ReviewedWorkData` in `src/`
- [ ] `npm run check`, `npm run lint`, `npm run test -- --max-workers=2` pass

---

## Stage 4: Replace `readingEntries` collection with computed entries

**Goal**: Remove the `readingEntries` collection. Rewrite `src/api/readings.ts` to
expand reading timelines and enrich entries directly from the constituent collections.
The `readingEntries` collection's source file (`reading-entries.json`) does not exist,
so the reading log currently renders 0 entries — this stage restores it.

**Status**: Not Started

### Call Stack

```
src/pages/readings/index.astro        ← fetches collections, passes .data arrays down
  └── getReadingLogProps(readings, works, reviews, authors)
        └── allReadingEntries(readings, works, reviews, authors)   ← main computation
```

The page does the `getCollection()` calls (consistent with all other pages). Neither
`getReadingLogProps` nor `allReadingEntries` call `getCollection` directly.

### Work

#### 1. `src/api/readings.ts` — rewrite `allReadingEntries`

**Current signature:** `allReadingEntries(entries: ReadingEntryData[]): ReadingEntries`

**New signature:** `allReadingEntries(readings: ReadingData[], works: WorkData[], reviews: ReviewData[], authors: AuthorData[]): ReadingEntries`

**New `ReadingEntry` type** (replaces `type ReadingEntry = ReadingEntryData`):

```ts
type ReadingEntry = {
  authors: { name: string; slug: string; sortName: string }[];
  edition: string;
  kind: WorkData["kind"];
  progress: string;          // from timeline[i].progress
  readingEntryDate: string;  // YYYY-MM-DD from timeline[i].date.toISOString().slice(0, 10)
  readingEntrySequence: number;
  reviewed: boolean;
  slug: string;              // work slug (reading.workSlug) — used by getFluidCoverImageProps
  title: string;
  workYear: string;
};
```

**Drop `includedInSlugs`** — was in `ReadingEntrySchema` but absent from `ReadingLogValue`
and unused anywhere in the reading log component, filters, and sorts.

**Remove `yearFormatter`** — the module-level `Intl.DateTimeFormat` const is no longer
needed; replace with `.slice(0, 4)` on the already-UTC YYYY-MM-DD string.

**Imports needed:** `AuthorData, ReadingData, ReviewData, WorkData` from `~/content.config`

**`ReadingEntry` placement**: Define at module level (not inside the function body) to
avoid potential lint issues with inner type declarations.

**Note on `getReadingLogProps` field consumption**: `getReadingLogProps` destructures
only 5 fields from the `allReadingEntries` return: `distinctEditions`, `distinctKinds`,
`distinctReadingYears`, `distinctWorkYears`, `readingEntries`. The count fields
(`abandonedCount`, `bookCount`, `shortStoryCount`, `workCount`) are computed but not
passed to `ReadingLogProps` — they exist on `ReadingEntries` but are not used by the
page. Preserve them in the return type for consistency but no changes to how they're
consumed.

**Computation:**

```ts
// Build lookup maps
const authorsMap    = new Map(authors.map(a => [a.slug, a]));
const worksMap      = new Map(works.map(w   => [w.slug, w]));
// ReviewData.slug is a { collection, id } reference — extract .id for the set
const reviewedSlugs = new Set(reviews.map(r => r.slug.id));

// Expand all timeline entries with a composite sort key
const rawEntries: Array<{ entry: ReadingEntry; sortKey: string }> = [];
for (const reading of readings) {
  const work = worksMap.get(reading.workSlug)!;
  const enrichedAuthors = work.authors.map(a => {
    const author = authorsMap.get(a.slug)!;
    return { name: author.name, slug: author.slug, sortName: author.sortName };
  });
  for (const timelineEntry of reading.timeline) {
    const dateStr = timelineEntry.date.toISOString().slice(0, 10);
    rawEntries.push({
      entry: {
        authors: enrichedAuthors,
        edition: reading.edition,
        kind: work.kind,
        progress: timelineEntry.progress,
        readingEntryDate: dateStr,
        readingEntrySequence: 0,  // assigned after sort
        reviewed: reviewedSlugs.has(reading.workSlug),
        slug: reading.workSlug,
        title: work.title,
        workYear: work.workYear,
      },
      sortKey: `${dateStr}-${String(reading.sequence).padStart(3, "0")}`,
    });
  }
}

// Sort ascending; assign 1-based sequence
rawEntries.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
const expandedEntries = rawEntries.map((raw, i) => ({
  ...raw.entry,
  readingEntrySequence: i + 1,
}));
```

**Distinct sets and counts** use `expandedEntries`. Replace `yearFormatter.format(...)`
with simple `readingEntryDate.slice(0, 4)` (the date is already UTC YYYY-MM-DD):

```ts
const distinctWorkYears    = new Set<string>();
const distinctReadingYears = new Set<string>();
const distinctKinds        = new Set<string>();
const distinctEditions     = new Set<string>();

for (const entry of expandedEntries) {
  distinctEditions.add(entry.edition);
  distinctKinds.add(entry.kind);
  distinctReadingYears.add(entry.readingEntryDate.slice(0, 4));
  distinctWorkYears.add(entry.workYear);
}

const terminalEntries = expandedEntries.filter(
  e => e.progress === "Finished" || e.progress === "Abandoned",
);
```

**Return shape is identical** (`ReadingEntries` type unchanged).

#### 2. `src/api/__fixtures__/readingEntries.ts` — delete

All tests that used this file will be rewritten to use the existing fixtures
(`readingDataFixtures`, `workDataFixtures`, `reviewDataFixtures`, `authorFixtures`).

#### 3. `src/api/readings.spec.ts` — rewrite

Use existing fixtures:
- `readingDataFixtures` from `__fixtures__/readings.ts` — 2 readings:
  - dark-crusade: sequence=1, edition="First Edition", workSlug="dark-crusade-by-karl-edward-wagner", timeline=[{2012-05-13, "14%"}, {2012-05-18, "Finished"}]
  - carrie: sequence=1, edition="Trade Paperback", workSlug="carrie-by-stephen-king", timeline=[{2023-06-15, "Finished"}]
- `workDataFixtures` from `__fixtures__/reviewedWorks.ts` — dark-crusade (Novel, 1976), carrie (Novel, 1974), linked-work
- `reviewDataFixtures` from `__fixtures__/reviews.ts` — reviews for dark-crusade, carrie, linked-work
- `authorFixtures` from `__fixtures__/authors.ts` — karl-edward-wagner, stephen-king, test-author

**Expected output from these fixtures** (3 entries, sorted ascending):

| seq | readingEntryDate | progress | slug                               | workYear |
| --- | ---------------- | -------- | ---------------------------------- | -------- |
| 1   | 2012-05-13       | 14%      | dark-crusade-by-karl-edward-wagner | 1976     |
| 2   | 2012-05-18       | Finished | dark-crusade-by-karl-edward-wagner | 1976     |
| 3   | 2023-06-15       | Finished | carrie-by-stephen-king             | 1974     |

Aggregates: `workCount=2, bookCount=2, shortStoryCount=0, abandonedCount=0`,
`distinctEditions=["First Edition", "Trade Paperback"]`, `distinctKinds=["Novel"]`,
`distinctReadingYears=["2012", "2023"]`, `distinctWorkYears=["1974", "1976"]`.

**Test scenarios to cover:**
- `allReadingEntries([], [], [], [])` → all counts 0, all distinct arrays empty
- 3 entries from 2 readings (timeline expansion — dark-crusade has 2 timeline entries)
- entries sorted by composite key ascending (dark-crusade-2012-05-13, dark-crusade-2012-05-18, carrie-2023-06-15)
- `readingEntrySequence` is 1-based index after sort (1, 2, 3)
- `reviewed` correct (dark-crusade and carrie both in `reviewDataFixtures`; entry 1's `reviewed: true`)
- `authors` enriched from `authorsMap` — e.g. entry 1: `[{ name: "Karl Edward Wagner", slug: "karl-edward-wagner", sortName: "Wagner, Karl Edward" }]`
- distinct values extracted and sorted alphabetically
- counts based on "Finished"/"Abandoned" only — entry 1 has progress "14%" so excluded from `workCount` (workCount=2, not 3)

**Remove** the `"passes entries through"` test — entries are now computed, not passed
through. Replace with expansion, enrichment, and sorting verification.

**Files confirmed NOT needing changes** (verified against source):
- `src/features/reading-log/ReadingLog.spec.tsx` — uses `createReadingValue()` helper that builds `ReadingLogValue` directly; entirely independent of the data layer
- `src/features/reading-log/ReadingLog.tsx` — `ReadingLogValue` type unchanged
- `src/features/reading-log/filterReadingLog.ts` — operates on `ReadingLogValue`
- `src/features/reading-log/sortReadingLog.ts` — operates on `ReadingLogValue`
- All other pages — no `readingEntries` collection usage anywhere except `index.astro`
- **No readings page snapshot test exists** (`src/pages/readings/` has no `.spec.ts`) — no snapshot updates needed for the page itself

#### 4. `src/features/reading-log/getReadingLogProps.ts` — update signature

Replace:
```ts
import type { ReadingEntryData } from "~/content.config";
```
With:
```ts
import type { AuthorData, ReadingData, ReviewData, WorkData } from "~/content.config";
```

Change signature from `getReadingLogProps(entries: ReadingEntryData[])` to
`getReadingLogProps(readings: ReadingData[], works: WorkData[], reviews: ReviewData[], authors: AuthorData[])`.

Change the call: `allReadingEntries(readings, works, reviews, authors)`.

Everything else in the function body is unchanged — all `ReadingEntry` field names
(`readingEntryDate`, `readingEntrySequence`, `slug`, `authors`, `edition`, `kind`,
`progress`, `reviewed`, `title`, `workYear`) are preserved exactly.

#### 5. `src/pages/readings/index.astro` — update collection fetches

Replace:
```ts
const readingEntriesResult = await getCollection("readingEntries");
const entries = readingEntriesResult.map((e) => e.data);
const readingLogProps = await getReadingLogProps(entries);
```
With:
```ts
const [readingsEntries, worksEntries, reviewsEntries, authorsEntries] = await Promise.all([
  getCollection("readings"),
  getCollection("works"),
  getCollection("reviews"),
  getCollection("authors"),
]);
const readingLogProps = await getReadingLogProps(
  readingsEntries.map((e) => e.data),
  worksEntries.map((e) => e.data),
  reviewsEntries.map((e) => e.data),
  authorsEntries.map((e) => e.data),
);
```

#### 6. `src/content.config.ts` — remove `readingEntries` collection

Remove:
- `ReadingEntryAuthorSchema` const
- `ReadingEntrySchema` const
- `readingEntries` collection const and `defineCollection(...)` block
- `ReadingEntryData` type export
- `readingEntries` from `export const collections = { ... }`

#### 7. Execution order

1. Rewrite `src/api/readings.ts`
2. Delete `src/api/__fixtures__/readingEntries.ts`
3. Rewrite `src/api/readings.spec.ts`
4. Update `src/features/reading-log/getReadingLogProps.ts`
5. Update `src/pages/readings/index.astro`
6. Remove `readingEntries` from `src/content.config.ts`
7. Delete `.astro/data-store.json`
8. Run `npm run check`, `npm run lint`, `npm run test -- --max-workers=2`
9. If snapshots fail: run `npm run test:update` and inspect diffs
   (reading log page now has real entries; snapshots will change)
10. Run `npm run build` — confirm reading log builds with real entry count
11. Run full pre-PR checklist

### Success Criteria

- [ ] `npm run build` succeeds — reading log page builds correctly with real entries
- [ ] Entry count matches total `timeline[]` entries across all reading files
- [ ] Reading log page (`/readings`) renders correctly in dev
- [ ] Filtering and sorting work correctly in dev
- [ ] Zero references to `getCollection('readingEntries')` or `ReadingEntryData` in `src/`
- [ ] `npm run check`, `npm run lint`, `npm run test -- --max-workers=2` pass
- [ ] Full pre-PR checklist passes:
  - [ ] `npm run lint:spelling`
  - [ ] `npm run knip`
  - [ ] `npm run format`
  - [ ] `npm run build` (clean run after deleting `.astro/data-store.json`)

---

## Dependency Order

```
Stage 1 (field renames — readings/reviews schemas + stats)
    ↓
Stage 2 (add works + moreForReviewedWorks; simplify authors)
    ↓
Stage 3 (reviewedWorks → direct collection joins)
    ↓
Stage 4 (readingEntries → getReadingLogProps)
```

Stages 3 and 4 are independent of each other once Stage 2 is complete.

---

## AIDEV-NOTE: Key Gotchas

- Always call `ctx.parseData()` before `store.set()` — Zod transforms (`z.coerce.date()`)
  only run if `parseData` is called; skipping it means dates arrive as strings at runtime
- Call `ctx.parseData` and `ctx.generateDigest` via `ctx.` — destructuring triggers
  `@typescript-eslint/unbound-method`
- Object literal keys in `content.config.ts` must be alphabetically sorted
  (`perfectionist/sort-objects` rule)
- Delete `.astro/data-store.json` after any loader change to prevent stale cached data
- `includedWorks` cannot use `reference()` — some included works are unreviewed and
  would fail build-time reference validation; enrich inline instead
- `gradeToValue` must handle the `"Abandoned"` case (value 0) in addition to letter grades
- `readingTime` uses the reading's frontmatter `date` field as the end date (not the
  last timeline entry date, though they are usually the same)
- `readingEntrySequence` sort key is
  `${timelineEntry.date}-${String(reading.sequence).padStart(3, '0')}` — sort by date
  alone is not deterministic when multiple readings have entries on the same date
- `reviewSequence` is the full slug of the most recent reading for the work (e.g.
  `"2022-09-19-01-carrie-by-stephen-king"`), derived by sorting the work's readings by
  `date` descending and taking the first entry's `slug` field
- The `reviews` schema field is now `slug` (not `workSlug`) — downstream consumers
  use `r.data.slug`, while `readings` uses `r.data.workSlug`
- `ReviewData.slug` is a `{ collection, id }` reference object (not a plain string) —
  use `r.slug.id` to get the work slug when building `reviewedSlugs` in `allReadingEntries`
- `allReadingEntries` count fields (`abandonedCount`, `bookCount`, `shortStoryCount`,
  `workCount`) are computed but NOT consumed by `getReadingLogProps` or `ReadingLogProps`
  — they exist for completeness but the reading log page only uses distinct arrays and entries
- `ReadingEntry` type must be defined at module level, not inside the function body
