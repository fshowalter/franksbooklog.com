# Intermediate Plan: Stage 4 — Replace `readingEntries` with computed entries

## Current State (confirmed by reading files)

**Stages 1, 2, 3 are fully implemented** in the codebase:
- `content.config.ts` has `works`, `moreForReviewedWorks`, simplified `authors`, `readings` (with `slug`/`workSlug`/`editionNotes`/`date`), `reviews` (with `slug: reference("works")`), `MostReadAuthorSchema.readings: z.array(reference("readings"))`
- `reviewedWorks` collection is gone
- `src/api/reviews.ts` uses the new join-based `allReviews(works, reviews, authors, readings)` approach
- `getStatsProps.ts` resolves reading refs via `readingsMap`
- Pages use `getCollection('works')` etc.

**Stage 4 is the remaining task.**

---

## The Problem

`reading-entries.json` **does not exist** (confirmed: `content/data/reading-entries.json` → no files found).

The `readingEntries` collection's `loadJsonArrayFile` loader returns early on ENOENT, so the collection is empty. The reading log page currently renders with 0 entries.

---

## Files to Change

### 1. `src/api/readings.ts` — rewrite `allReadingEntries`

**Current signature:** `allReadingEntries(entries: ReadingEntryData[]): ReadingEntries`

**New signature:** `allReadingEntries(readings: ReadingData[], works: WorkData[], reviews: ReviewData[], authors: AuthorData[]): ReadingEntries`

**New `ReadingEntry` shape** (replace the old `ReadingEntryData` alias):
```ts
type ReadingEntry = {
  authors: { name: string; slug: string; sortName: string }[];
  edition: string;
  kind: WorkData["kind"];
  progress: string;         // from timeline[i].progress
  readingEntryDate: string; // YYYY-MM-DD from timeline[i].date.toISOString().slice(0, 10)
  readingEntrySequence: number;
  reviewed: boolean;
  slug: string;             // work slug (reading.workSlug)
  title: string;
  workYear: string;
};
```

**Drop `includedInSlugs`** — it was in `ReadingEntrySchema` but is NOT in `ReadingLogValue` and not used anywhere in the reading log component, filtering, or sorting.

**Computation logic:**
```
1. Build authorsMap (slug → AuthorData), worksMap (slug → WorkData), reviewedSlugs (Set<string> of review work slugs via r.slug.id)
2. For each reading, for each timeline entry:
   - dateStr = timelineEntry.date.toISOString().slice(0, 10)
   - sortKey = `${dateStr}-${String(reading.sequence).padStart(3, '0')}`
3. Sort rawEntries by sortKey ascending (localeCompare)
4. Map to ReadingEntry (index + 1 = readingEntrySequence), building distinct sets along the way
5. Counts: filter entries where progress === "Finished" || "Abandoned"
```

**`ReadingEntries` type stays the same** (abandonedCount, bookCount, distinctEditions, distinctKinds, distinctReadingYears, distinctWorkYears, readingEntries, shortStoryCount, workCount).

**Imports needed:** `AuthorData, ReadingData, ReviewData, WorkData` from `~/content.config`

### 2. `src/api/__fixtures__/readingEntries.ts` — delete

Replace with new fixture data inside `readings.spec.ts` directly, or create a new fixture file using `ReadingData[]`, `WorkData[]`, `ReviewData[]`, `AuthorData[]`.

The existing fixtures (`readings.ts`, `reviewedWorks.ts`, `reviews.ts`, `authors.ts`) already have the right shapes and can be reused in the new test.

### 3. `src/api/readings.spec.ts` — rewrite tests

Use existing fixtures:
- `readingDataFixtures` from `__fixtures__/readings.ts` (has 2 readings: dark-crusade, carrie)
- `workDataFixtures` from `__fixtures__/reviewedWorks.ts` (has dark-crusade, carrie, linked-work)
- `reviewDataFixtures` from `__fixtures__/reviews.ts` (reviews for dark-crusade, carrie, linked-work)
- `authorFixtures` from `__fixtures__/authors.ts` (karl-edward-wagner, stephen-king, test-author)

**Key test scenarios to cover:**
- empty arrays → empty result, all counts 0
- entries sorted by composite key
- readingEntrySequence assigned correctly (1-based index)
- multi-step timeline entries expand correctly (dark-crusade has 2 timeline entries: "14%" + "Finished")
- reviewed boolean correct (dark-crusade and carrie both reviewed, linked-work not in readings)
- distinct values extracted correctly
- counts: bookCount, shortStoryCount, abandonedCount, workCount based on "Finished"/"Abandoned" entries only

**Note:** `readingDataFixtures` dark-crusade has 2 timeline entries → 2 reading entries in output. carrie has 1 → 1 entry. Total 3 entries, sorted by date.

### 4. `src/features/reading-log/getReadingLogProps.ts` — update signature

**Current:** `getReadingLogProps(entries: ReadingEntryData[])`
**New:** `getReadingLogProps(readings: ReadingData[], works: WorkData[], reviews: ReviewData[], authors: AuthorData[])`

Replace:
```ts
import type { ReadingEntryData } from "~/content.config";
import { allReadingEntries } from "~/api/readings";
```
With:
```ts
import type { AuthorData, ReadingData, ReviewData, WorkData } from "~/content.config";
import { allReadingEntries } from "~/api/readings";
```

Change the call and destructure as before. Everything else stays the same (the `ReadingLogValue` mapping is unchanged).

### 5. `src/pages/readings/index.astro` — update collections

**Current:**
```ts
const readingEntriesResult = await getCollection("readingEntries");
const entries = readingEntriesResult.map((e) => e.data);
const readingLogProps = await getReadingLogProps(entries);
```

**New:**
```ts
const [readingsEntries, worksEntries, reviewsEntries, authorsEntries] = await Promise.all([
  getCollection("readings"),
  getCollection("works"),
  getCollection("reviews"),
  getCollection("authors"),
]);
const readings = readingsEntries.map((e) => e.data);
const works = worksEntries.map((e) => e.data);
const reviews = reviewsEntries.map((e) => e.data);
const authors = authorsEntries.map((e) => e.data);
const readingLogProps = await getReadingLogProps(readings, works, reviews, authors);
```

### 6. `src/content.config.ts` — remove readingEntries collection

Remove:
- `ReadingEntryAuthorSchema` const
- `ReadingEntrySchema` const
- `readingEntries` collection const and its `defineCollection(...)` block
- `ReadingEntryData` from the exported types
- Remove `readingEntries` from `export const collections = { ... }`

---

## Files NOT needing changes (confirmed)

- `src/features/reading-log/ReadingLog.tsx` — `ReadingLogValue` type doesn't change
- `src/features/reading-log/filterReadingLog.ts` — operates on `ReadingLogValue`
- `src/features/reading-log/sortReadingLog.ts` — uses `entrySequence` (unchanged)
- `src/features/reading-log/ReadingLog.spec.tsx` — uses `createReadingValue()` helper, not fixtures
- `src/api/reviews.ts` — unrelated
- All other pages — don't use `readingEntries`

## Still Need to Verify (open questions)

1. **Are there any other callers of `allReadingEntries` or `ReadingEntryData`?**
   Grep found only: `content.config.ts`, `getReadingLogProps.ts`, `readingEntries.ts` fixture, `readings.spec.ts`, `readings.ts` API. That's the complete set.

2. **Does `readings.spec.ts` test `allReadingEntries` exclusively?** Yes — it only imports `allReadingEntries` and `readingEntryFixtures`.

3. **Are page snapshot tests affected?** The `src/pages/__snapshots__/` files are already in git diff — they may need updating after Stage 4 (reading log page will now have real entries). Run `npm run test:update` after Stage 4 to regenerate.

4. **Does `knip` flag `readingEntries.ts` fixture as unused after deletion?** No — it will be deleted. Check that no other file imports from `__fixtures__/readingEntries.ts`.

5. **`content/readings/*.md` files** — already have the new frontmatter format (`slug:`, `workSlug:`, `editionNotes:`, `date:`). Confirmed by reading one file. No content changes needed.

---

## Why PLAN.md Stage 4 Was Incomplete

PLAN.md Stage 4 was planned more loosely than stages 1–3. Stages 1–3 were written after the actual code existed and could be inspected. Stage 4 was written more speculatively, without tracing through the existing call stack.

**What PLAN.md did cover:** expanding `timeline[]`, sort key, `readingEntrySequence`, removing the collection and schema.

**What it missed and why:**

1. **`src/api/readings.ts`** — PLAN said "rewrite `getReadingLogProps`" without noticing `getReadingLogProps` delegates to `allReadingEntries()` in the API layer. The plan didn't trace the call stack one level deeper.

2. **`src/api/readings.spec.ts` and `src/api/__fixtures__/readingEntries.ts`** — every other stage explicitly listed test/fixture files to update (stage 1 listed `__fixtures__/readings.ts`, `__fixtures__/reviews.ts`, etc.). Stage 4 listed none. The plan didn't check what test coverage existed for the code being replaced.

3. **`src/pages/readings/index.astro`** — not listed as a file to change. In this codebase, pages do `getCollection()` calls and pass `.data` arrays down; `getReadingLogProps` never calls `getCollection()` directly. PLAN attributed the collection fetching to `getReadingLogProps` itself, which contradicts the established pattern.

4. **`authors` collection** — PLAN listed `readings + works + reviews` as needed but missed `authors` for name enrichment on reading entries. The spec's field table (enriched author name/sortName) implies it, but the plan didn't spell it out.

---

## Execution Order

1. Rewrite `src/api/readings.ts`
2. Delete `src/api/__fixtures__/readingEntries.ts`
3. Rewrite `src/api/readings.spec.ts`
4. Update `src/features/reading-log/getReadingLogProps.ts`
5. Update `src/pages/readings/index.astro`
6. Update `src/content.config.ts` (remove readingEntries)
7. Delete `.astro/data-store.json`
8. Run `npm run check`, `npm run lint`, `npm run test -- --max-workers=2`
9. If snapshots fail: run `npm run test:update` and inspect diffs
10. Run `npm run build` to confirm reading log page builds with real data
11. Run full pre-PR checklist: `npm run lint:spelling`, `npm run knip`, `npm run format`

---

## Success Criteria (from PLAN.md Stage 4)

- [ ] `npm run build` succeeds — reading log page builds correctly
- [ ] Entry count matches total `timeline[]` entries across all reading files
- [ ] Reading log page (`/readings`) renders correctly in dev
- [ ] Zero references to `getCollection('readingEntries')` or `ReadingEntryData` in `src/`
- [ ] `npm run check`, `npm run lint`, `npm run test -- --max-workers=2` pass
- [ ] `npm run lint:spelling`, `npm run knip`, `npm run format`, `npm run build` pass
