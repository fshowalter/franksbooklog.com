# Plan: Content Data Restructuring

See `spec.md` for full rationale, field derivation details, and downstream change lists.

---

## Stage 1: Rename fields in `readings` and `reviews`; update stats schemas

**Goal**: Update schemas, loaders, and all downstream consumers for the frontmatter
key renames in `readings/*.md` and `reviews/*.md`. Remove `MostReadAuthorReadingSchema`
and replace with `reference("readings")`. No new collections yet.

**Status**: Not Started

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

**Status**: Not Started

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

**Status**: Not Started

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

## Stage 4: Replace `readingEntries` collection with `getReadingLogProps` computation

**Goal**: Remove the `readingEntries` collection. Rewrite `getReadingLogProps` to
expand reading timelines and enrich entries directly from collections.

**Status**: Not Started

### Work

1. **`src/features/reading-log/getReadingLogProps.ts`** (or equivalent):
   - Replace `getCollection('readingEntries')` with:
     - `getCollection('readings')` — all reading records
     - `getCollection('works')` — for title, authors, kind, workYear
     - `getCollection('reviews')` — to compute the `reviewed` boolean
   - Expand each reading's `timeline[]` into individual entry objects, tagging each
     with the reading's `sequence` field
   - Sort all entries by composite key
     `${timelineEntry.date}-${String(reading.sequence).padStart(3, '0')}` ascending —
     deterministic across same-date entries from different readings
   - Assign `readingEntrySequence = index + 1`
   - Enrich per the field table in spec.md

2. **`src/content.config.ts`** — remove the `readingEntries` collection and
   `ReadingEntrySchema` entirely. Remove `ReadingEntryData` export.

3. Delete `.astro/data-store.json` before testing.

### Success Criteria

- [ ] `npm run build` succeeds — reading log page builds correctly
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
