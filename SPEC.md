# Spec: Content Data Restructuring

## Overview

The source data in `content/` has been reorganized to remove three large pre-baked
JSON files and replace them with smaller, normalized source files. The content loaders
in `src/content.config.ts` must be updated to match the new file shapes. All derived
data (reviewed work shapes, reading timeline entries) moves out of the content store
and into each feature's getProps function, assembled from `getCollection()` calls at
build time.

The result: `content.config.ts` contains only simple loaders — no joins, no
cross-collection lookups, no digest complexity. The collections themselves are the
shared data layer; no intermediate helper functions are needed.

---

## Source Data Changes

### Deleted files

| File                                 | Was used by                        |
| ------------------------------------ | ---------------------------------- |
| `content/data/reviewed-works.json`   | `reviewedWorks` collection loader  |
| `content/data/reading-entries.json`  | `readingEntries` collection loader |
| `content/data/timeline-entries.json` | Old data layer (already unused)    |

### New files

**`content/data/works/*.json`** — one file per work, core metadata only:

```json
{
  "title": "Carrie",
  "subtitle": null,
  "sortTitle": "Carrie",
  "year": "1974",
  "kind": "Novel",
  "slug": "carrie-by-stephen-king",
  "authors": [{ "slug": "stephen-king", "notes": null }],
  "includedWorks": []
}
```

`includedWorks` is an array of work slugs (strings), not objects.

**`content/data/more-for-reviewed-works.json`** — `moreByAuthors` and `moreReviews`
per reviewed work:

```json
[{
  "work": "carrie-by-stephen-king",
  "moreByAuthors": [
    { "author": "stephen-king", "reviews": ["salems-lot-by-stephen-king", ...] }
  ],
  "moreReviews": ["salems-lot-by-stephen-king", ...]
}]
```

### Changed files

**`content/data/authors/*.json`** — `reviewedWorks` field removed:

```json
{ "name": "Stephen King", "sortName": "King, Stephen", "slug": "stephen-king" }
```

**`content/reviews/*.md`** — frontmatter key renamed:

- `work_slug: carrie-by-stephen-king` → `slug: carrie-by-stephen-king`

**`content/readings/*.md`** — frontmatter changes:

- Added `slug: 2022-09-19-01-carrie-by-stephen-king` (unique reading ID = filename)
- Added `date: 2022-09-19` (completion date, was only in timeline)
- `work_slug:` → `workSlug:`
- `edition_notes:` → `editionNotes:`

---

## Content Collections After Restructuring

Seven simple loaders — no cross-collection lookups, no joins.

### `works` collection (NEW)

Simple loader from `data/works/*.json`. One entry per file. Entry ID = work slug.

| Field           | Source                                                      |
| --------------- | ----------------------------------------------------------- |
| `title`         | `works/*.json`                                              |
| `subtitle`      | `works/*.json`                                              |
| `sortTitle`     | `works/*.json`                                              |
| `workYear`      | `works/*.json` `year` field                                 |
| `kind`          | `works/*.json`                                              |
| `slug`          | `works/*.json`                                              |
| `authors`       | `works/*.json` (slug + notes only — no name enrichment)     |
| `includedWorks` | `works/*.json` (plain slug strings)                         |

### `authors` collection (simplified)

The `reviewedWorks` field is removed from the schema. The loader reads raw JSON only.
Each feature's getProps computes the author's reviewed works by filtering the `reviews`
collection by work slug.

| Field      | Source               |
| ---------- | -------------------- |
| `name`     | `authors/*.json`     |
| `sortName` | `authors/*.json`     |
| `slug`     | `authors/*.json`     |

### `reviews` collection (minor change)

Loader change: read from `frontmatter.slug` (was `frontmatter.work_slug`).
Schema field rename: `work_slug` → `slug`. Entry ID = work slug (filename stem).

### `readings` collection (minor changes)

Schema field renames and two new fields:

| Old field       | New field      | Notes                                      |
| --------------- | -------------- | ------------------------------------------ |
| `work_slug`     | `workSlug`     | Plain `z.string()` — no longer a reference |
| `edition_notes` | `editionNotes` |                                            |
| —               | `slug`         | New: unique reading ID = filename stem     |
| —               | `date`         | New: `z.coerce.date()` from frontmatter    |

`work_slug` was `reference("reviewedWorks")`. With the `reviewedWorks` collection
removed, `workSlug` becomes a plain string.

`slug` is the reading's own unique identifier (e.g. `2022-09-19-01-carrie-by-stephen-king`),
matching the filename stem. The collection entry ID is already derived from the filename,
so `slug === entry.id` always. It is stored on the schema so downstream code and
references can use it without re-deriving from the filename.

Loader `buildData` changes:
- `frontmatter.work_slug` → `frontmatter.workSlug`
- `frontmatter.edition_notes` → `frontmatter.editionNotes`
- Add `slug: frontmatter.slug as string`
- Add `date: frontmatter.date`

### `moreForReviewedWorks` collection (NEW)

`content/data/more-for-reviewed-works.json` as a content collection. Entry ID = work
slug (`raw.work`). Enables `getEntry('moreForReviewedWorks', workSlug)` on individual
review pages — single-entry lookup instead of loading and filtering the whole file.

Schema:

```ts
z.object({
  moreByAuthors: z.array(z.object({
    author: z.string(),
    reviews: z.array(z.string()),
  })),
  moreReviews: z.array(z.string()),
  work: z.string(),
})
```

### `alltimeStats` / `yearStats` collections (schema change)

The `readings` array inside `mostReadAuthors` changed from full embedded objects to
plain reading slug strings in the source JSON. The schema must follow:

- `MostReadAuthorReadingSchema` is removed
- `MostReadAuthorSchema.readings` changes from `z.array(MostReadAuthorReadingSchema)`
  to `z.array(reference("readings"))`

`getStatsProps.ts` must be updated: `createMostReadAuthorsListItemValueProps` currently
spreads each `reading` directly (using `reading.slug` as the work slug for cover images
and `reading.date` for display). After the change, each reading is a
`{ collection: "readings", id: "..." }` reference. The function must call
`getCollection('readings')` to build a lookup map, then use `reading.data.workSlug` for
cover images and `reading.data.date` for the display date.

### Dropped collections

| Collection      | Replacement                                                   |
| --------------- | ------------------------------------------------------------- |
| `reviewedWorks` | Each consumer joins `works` + `reviews` + `authors` directly  |
| `readingEntries`| Computed in `getReadingLogProps` from `readings` + `works` + `reviews` |

These were computed collections whose joins are cheap JavaScript on already-loaded
collection data. Each consumer only needs a subset of the full shape, so a single
pre-joined collection was doing unnecessary work for most callers. Moving the joins
into each getProps function lets each caller fetch exactly what it needs.

---

## API Layer Changes

### Pattern: join in getProps, not in a shared helper

Each getProps function calls the collections it needs and builds local maps for O(1)
lookup. The collections themselves are the shared data layer — no intermediate helper
functions are needed.

Typical pattern:

```ts
const worksMap = new Map((await getCollection('works')).map(e => [e.id, e.data]));
const reviewsMap = new Map((await getCollection('reviews')).map(e => [e.id, e.data]));
const authorsMap = new Map((await getCollection('authors')).map(e => [e.id, e.data]));
```

### Consumer breakdown

**`getReviewsProps`** (reviews list) — needs title, slug, kind, workYear, authors,
grade, gradeValue, reviewDate, reviewSequence, reviewYear, sortTitle:
- `getCollection('works')` + `getCollection('reviews')` + `getCollection('authors')`
- Compute `gradeValue` and `reviewYear` inline

**`getAuthorTitlesProps`** (author page) — same shape as reviews list, filtered by author:
- Same three collections; filter `reviews` to works where `works[slug].authors` includes this author

**`getReviewProps`** (individual review page) — full shape including readings[],
moreByAuthors[], moreReviews[], includedWorks[]:
- `getEntry('works', slug)` + `getEntry('reviews', slug)`
- `getCollection('readings')` filtered by `workSlug`
- `getEntry('moreForReviewedWorks', slug)`
- `getCollection('authors')` for name enrichment
- `getCollection('works')` for `includedWorks` enrichment and `includedInSlugs`

**`getAuthorsProps`** (authors list) — needs reviewed work count per author:
- `getCollection('reviews')` → build a Set of reviewed work slugs, look up
  `works[slug].authors` to count per author

**`linkReviewedWorks`** — needs only the set of reviewed slugs:
- `getCollection('reviews').map(e => e.id)` — no work data needed

**`getReadingLogProps`** — expand all reading timelines:
- `getCollection('readings')` + `getCollection('works')` + `getCollection('reviews')`
- Expand each reading's `timeline[]` into individual entries
- Sort by composite key `${timelineEntry.date}-${String(reading.sequence).padStart(3, '0')}` ascending
- Assign `readingEntrySequence = index + 1`

#### Derived fields computed in getProps

**`gradeValue`**:

| Grade | Value | Grade     | Value |
| ----- | ----- | --------- | ----- |
| A     | 12    | C+        | 7     |
| A-    | 11    | C         | 6     |
| B+    | 10    | C-        | 5     |
| B     | 9     | D+        | 4     |
| B-    | 8     | D         | 3     |
| —     | —     | D-        | 2     |
| —     | —     | F         | 1     |
| —     | —     | Abandoned | 0     |

**`reviewSequence`** — the `slug` of the most recent (latest by `date`) reading for
this work. Sort the work's readings by `date` descending; take the first entry's `slug`.

**`reviewYear`** — first 4 chars of `reviewDate`.

**`readings[].readingTime`**:

```
readingTime = (reading.date − reading.timeline[0].date).days + 1
```

Strict date arithmetic. Same-day start and end = 1 day.

**`readings[].isAudiobook`** — `edition === "Audiobook"`.

**`readings[].abandoned`** — last `timeline[]` progress is `"Abandoned"`.

**`includedWorks[]`** — each slug in `work.includedWorks` expanded inline (cannot use
`reference()` — some included works are unreviewed):

- `slug`, `title`, `kind`, `workYear` — from `works` collection
- `authors[].{name, slug}` — `works` collection cross-ref `authors` collection
- `grade` — from `reviews` collection (only if reviewed)
- `reviewed` — whether an entry exists in `reviews`

**`includedInSlugs[]`** — works that list this slug in their own `includedWorks`.
Invert `includedWorks` across all works once per getProps call that needs it.

---

## Downstream Changes in `src/`

### `src/api/reviews.ts`

```diff
- reviews.find((r) => r.work_slug.id === work.slug)
+ reviews.find((r) => r.slug.id === work.slug)

- readings.find((r) => r.work_slug.id === review.slug)
+ readings.find((r) => r.workSlug.id === review.slug)
```

### `src/features/review/getReviewProps.ts`

```diff
- reviews.find((r) => r.work_slug.id === ref.id)
+ reviews.find((r) => r.slug.id === ref.id)
```

### `src/api/__fixtures__/readings.ts`

```diff
- work_slug: { collection: "reviewedWorks", id: "..." }
+ workSlug: "...",
- edition_notes: undefined,
+ editionNotes: undefined,
+ slug: "...",
```

### `src/api/__fixtures__/reviews.ts`

```diff
- work_slug: { collection: "reviewedWorks", id: "..." }
+ slug: { collection: "reviews", id: "..." }
```

### `src/features/stats/getStatsProps.ts`

`createMostReadAuthorsListItemValueProps` must resolve reading references before
enriching. Each `author.readings[n]` is now `{ collection: "readings", id: "..." }`:

```diff
  async function createMostReadAuthorsListItemValueProps(
    authors: MostReadAuthor[],
+   readingsMap: Map<string, CollectionEntry<'readings'>>,
  ) {
      readings: await Promise.all(
-       author.readings.map(async (reading) => ({
-         ...reading,
-         coverImageProps: await getFluidCoverImageProps(reading, ...),
-         displayDate: displayDate(reading.date),
-       })),
+       author.readings.map(async (ref) => {
+         const reading = readingsMap.get(ref.id)!.data;
+         return {
+           ...reading,
+           coverImageProps: await getFluidCoverImageProps({ slug: reading.workSlug }, ...),
+           displayDate: displayDate(reading.date),
+         };
+       }),
      ),
  }
```

---

## Watch Behavior

Simple loaders watch their own source only — no cross-collection watchers needed.

| Collection             | Paths to watch                      |
| ---------------------- | ----------------------------------- |
| `works`                | `data/works/`                       |
| `authors`              | `data/authors/`                     |
| `reviews`              | `reviews/`                          |
| `readings`             | `readings/`                         |
| `moreForReviewedWorks` | `data/more-for-reviewed-works.json` |
| `alltimeStats`         | `data/all-time-stats.json`          |
| `yearStats`            | `data/year-stats/`                  |

The API layer joins re-run on every build automatically — no watcher registration needed.

---

## Digest Strategy

All collections are simple loaders. Digest raw content as before — no composite digest
logic needed.
