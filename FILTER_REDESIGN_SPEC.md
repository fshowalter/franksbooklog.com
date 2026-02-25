# Filter & Sort Redesign Spec

## Overview

Port the filter-and-sort UI improvements from `franksmovielog.com` to `franksbooklog.com`. The
reference implementation is live at https://www.franksmovielog.com/reviews.

**General principle:** Prefer direct ports from `franksmovielog.com`. When a direct port is not
possible, this spec documents the reason and the specific delta.

### Five New Capabilities

1. **Applied Filters section** — Chips inside the filter drawer showing each active filter, each
   removable with ×. Chips appear only after "View Results" is clicked (applied filters), not while
   changes are pending — adding chips immediately would cause layout shift. Chip removal IS
   immediate (no "View Results" required), because removing a filter never changes the result count
   direction.

2. **Collapsible filter sections** — Every filter field (Title, Kind, Grade, Work Year, etc.) is
   wrapped in a `<details>/<summary>` with smooth height + opacity animation via `FilterSection`.
   This wrapping happens inside each field component itself (TextField, GradeField, YearField) or
   via an explicit `FilterSection` in the filter container (CheckboxListField groups).

3. **Multi-select checkboxes for dropdowns** — Replace single-value `SelectField` dropdowns for
   `kind` (all features), `edition` (ReadingLog), and `reviewedStatus` (ReadingLog) with
   `CheckboxListField`. Filter values change from `string` to `readonly string[]`.

4. **Mobile sort radio list** — On mobile (<640px / `tablet` breakpoint), the filter drawer shows
   a collapsible "Sort by" section with uncontrolled radio buttons. Desktop keeps the existing
   dropdown in the header. Sort is applied only when "View Results" is clicked.

5. **Grade and Year range sliders** — `GradeField` and `YearField` gain a `RangeSliderField`
   beneath the From/to dropdowns. The slider syncs bidirectionally with the dropdowns. Both fields
   also gain `onClear` callbacks and wrap themselves in `FilterSection` (same as the movie log).

---

## Reference Implementation Mapping

| Movie log file                                         | Book log target                                          | Port type                                                 |
| ------------------------------------------------------ | -------------------------------------------------------- | --------------------------------------------------------- |
| `FilterSection.tsx`                                    | New: `src/components/filter-and-sort/FilterSection.tsx`  | Direct port                                               |
| `AppliedFilters.tsx`                                   | New: `src/components/filter-and-sort/AppliedFilters.tsx` | Direct port                                               |
| `CheckboxListField.tsx`                                | New: `src/components/fields/CheckboxListField.tsx`       | Direct port                                               |
| `RangeSliderField.tsx`                                 | New: `src/components/fields/RangeSliderField.tsx`        | Direct port                                               |
| `TextField.tsx`                                        | Modify existing                                          | Direct port                                               |
| `FilterAndSortContainer.tsx`                           | Modify existing                                          | Direct port — rename `topNav` → `sideNav`; update Authors |
| `FilterAndSortHeader.tsx`                              | Modify existing                                          | Direct port                                               |
| `GradeField.tsx`                                       | Modify existing                                          | Direct port — requires grade scale migration              |
| `YearField.tsx`                                        | Modify existing                                          | Direct port                                               |
| `TitleFilters.tsx` → `WorkFilters.tsx`                 | Modify existing                                          | Modified port — domain names differ                       |
| `ReviewedTitleFilters.tsx` → `ReviewedWorkFilters.tsx` | Modify existing                                          | Modified port                                             |
| `appliedFilterChips.ts` (per feature)                  | New per-feature `buildAppliedFilterChips.ts`             | New                                                       |

---

## File-by-File Specification

### 1. NEW: `src/components/filter-and-sort/FilterSection.tsx`

**Port type:** Direct port.

- Wraps `<details>/<summary>` with smooth height transition (300ms cubic-bezier).
- `defaultOpen?: boolean` (default `true`).
- Uses direct DOM manipulation (`classList`, `open`) to avoid React controlled/uncontrolled
  conflicts.
- Opening: height `0` → `open=true` → `scrollHeight`. Closing: `scrollHeight` → `is-closing`
  class → `0` → `open=false` on `transitionend`.
- Opacity: CSS-based via `[open]:not(.is-closing)` selector.
- Arrow SVG points up by default, rotates 180° when open (`group-open:rotate-180`).
- Keep all `AIDEV-NOTE` comments from the movie log version.

---

### 2. NEW: `src/components/filter-and-sort/FilterSection.spec.tsx`

**Port type:** Direct port. Covers open/closed default state, title, disclosure triangle, initial
height, snapshots.

---

### 3. NEW: `src/components/filter-and-sort/AppliedFilters.tsx`

**Port type:** Direct port.

- Renders nothing when `filters` array is empty.
- Wrapped in `<FilterSection title="Applied Filters">`.
- Each chip is a `<button type="button">` with `aria-label="Remove {displayText} filter"`.
- Display text rules:
  - Simple filters (Kind, Edition, Status): value only → `"Novel"`
  - Range/search: `"Category: Value"` → `"Grade: A- to B+"`, `"Search: dune"`
  - Detection: category contains `"Grade"` or `"Year"`, or category `=== "Search"`.
- "Clear all" link calls `onClearAll`; this must clear both active and pending immediately.

```typescript
export type FilterChip = {
  category: string;
  id: string;
  label: string;
};
```

---

### 4. NEW: `src/components/filter-and-sort/AppliedFilters.spec.tsx`

**Port type:** Direct port.

---

### 5. NEW: `src/components/fields/CheckboxListField.tsx`

**Port type:** Direct port.

- Multi-select with show-more and clear functionality.
- Selected items float to top before "Show more" is clicked.
- `onClear?` + `onChange([])` on clear.
- Listens for form `reset`.
- Syncs from `defaultValues` via `useEffect`.

---

### 6. NEW: `src/components/fields/RangeSliderField.tsx`

**Port type:** Direct port. Also port `RangeSliderField.spec.tsx`.

- Dual-handle `<input type="range">` slider, numeric `min`/`max`.
- Optional `formatValue` (used by GradeField for letter labels).
- "Clear" link when not at full range.
- Keyboard navigation, ARIA attributes, screen-reader live region.

---

### 7. NEW: `src/utils/grades.ts`

**Port type:** Direct port for `gradeToLetter`. Both codebases use the same 2-16 scale after the
grade scale migration. Also export `gradeToValue` (new — consolidates private copies in
`src/api/reviews.ts` and `src/features/author-titles/getAuthorTitlesProps.ts`):

```typescript
// Shared scale: 2 (F-) to 16 (A+)
export function gradeToLetter(value: number): string {
  const map: Record<number, string> = {
    16: "A+",
    15: "A",
    14: "A-",
    13: "B+",
    12: "B",
    11: "B-",
    10: "C+",
    9: "C",
    8: "C-",
    7: "D+",
    6: "D",
    5: "D-",
    4: "F+",
    3: "F",
    2: "F-",
  };
  return map[value] ?? String(value);
}

export function gradeToValue(grade: string): number {
  const map: Record<string, number> = {
    "A+": 16,
    A: 15,
    "A-": 14,
    "B+": 13,
    B: 12,
    "B-": 11,
    "C+": 10,
    C: 9,
    "C-": 8,
    "D+": 7,
    D: 6,
    "D-": 5,
    "F+": 4,
    F: 3,
    "F-": 2,
  };
  return map[grade] ?? 0; // Abandoned and unknown → 0
}
```

Full grade range = `[2, 16]`. `Abandoned` entries have `gradeValue=0` (below the slider range)
and are filtered separately via `ReviewedStatusFilter` (see §28).

---

### 8. MODIFY: `src/components/fields/TextField.tsx`

**Port type:** Direct port. Replace the entire file with the movie log's version. The resulting
file is identical: same prop interface, same `debounceOnChange` logic, same `FilterSection`
wrapper — the only difference between the current book log version and the movie log version is
the `<label>/<LabelText>` wrapper (book log) vs `<FilterSection>` (movie log), and
`React.FormEvent` vs `React.ChangeEvent` on `handleChange`. Both are resolved by the direct copy.

**Impact:** All uses of `TextField` (WorkFilters title, CollectionFilters name,
ReadingLogFilters title) automatically gain collapsible sections.

**AIDEV-NOTE:** `TextField` is uncontrolled. When a title/name chip is removed via
`removeAppliedFilter`, the input's DOM value does not automatically clear. Verify how the movie
log handles this (likely via a `key` prop on the TextField that changes when `defaultValue` goes
from a value to `undefined`, forcing remount).

---

### 9. MODIFY: `src/components/filter-and-sort/FilterAndSortContainer.tsx`

**Port type:** Direct port — rename `topNav` → `sideNav` to match the movie log. The Authors
feature's `AlphabetNav` currently passes via `topNav` (renders above the entire list area). After
this change it will pass via `sideNav` (renders as a flex column alongside the list), which
matches how the movie log uses the prop. `Authors.tsx` must be updated accordingly (see §29).

**Changes from book log's current version:**

- Rename `topNav` prop → `sideNav` (update Authors.tsx to match).
- Add `activeFilters?: FilterChip[]` prop.
- Add `onRemoveFilter?: (id: string) => void` prop.
- Add `suppressSortScrollRef = useRef(false)`.
- In the drawer `<div className="px-container ...">`, add before `{filters}`:
  1. `<AppliedFilters>` conditional on `activeFilters && onRemoveFilter`.
  2. Mobile sort radios (hidden `tablet:` and above):
     ```jsx
     <div className="tablet:hidden">
       <FilterSection defaultOpen={true} title="Sort by">
         <div className="space-y-3">
           {sortProps.sortOptions.map(({ label, value }) => (
             <label
               className="flex cursor-pointer items-center gap-3"
               key={value}
             >
               <input
                 className="size-4 cursor-pointer accent-accent"
                 defaultChecked={sortProps.currentSortValue === value}
                 name="sort"
                 type="radio"
                 value={value}
               />
               <span className="text-sm">{label}</span>
             </label>
           ))}
         </div>
       </FilterSection>
     </div>
     ```
- "View Results" click: read `sort` radio from `formRef`, call `sortProps.onSortChange(sortValue)`
  with `suppressSortScrollRef.current = true`, then `onApplyFilters()`.
- `handleCloseDrawer` (existing) already resets the form, reverting radio state.

**AIDEV-NOTE:** Keep the existing `AIDEV-NOTE` about `suppressSortScrollRef`.

**Props interface:**

```typescript
type Props<T extends string> = {
  activeFilters?: FilterChip[];
  children: React.ReactNode;
  className?: string;
  filters: React.ReactNode;
  hasPendingFilters: boolean;
  headerLink?: { href: string; text: string };
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onFilterDrawerOpen: () => void;
  onRemoveFilter?: (id: string) => void;
  onResetFilters: () => void;
  pendingFilteredCount: number;
  sideNav?: React.ReactNode;
  sortProps: SortProps<T>;
  totalCount: number;
};
```

---

### 10. MODIFY: `src/components/filter-and-sort/FilterAndSortHeader.tsx`

**Port type:** Direct port. Replace the entire file with the movie log's version. The only
functional difference visible to users is the responsive "Filter & Sort" / "Filter" button label;
the rest of the layout CSS is identical.

---

### 11. MODIFY: `src/components/filter-and-sort/WorkFilters.tsx`

**Port type:** Modified port — `kind` replaces `genres`; no `counts` existed before.

**Kind filter: SelectField → CheckboxListField inside FilterSection.**

Updated `kind` prop:

```typescript
kind: {
  counts?: Map<string, number>;
  defaultValues?: readonly string[];
  onChange: (values: string[]) => void;
  onClear?: () => void;
  values: readonly string[];
};
```

Rendered inside `<FilterSection title="Kind">`. `CheckboxListField` receives options built from
`kind.values.map(v => ({ label: v, value: v, count: kind.counts?.get(v) ?? 0 }))`.

`TextField` (title) and `YearField` (work year) are unchanged — both now internally wrap
themselves in `FilterSection` (see §8 and §13).

---

### 12. MODIFY: `src/components/filter-and-sort/ReviewedWorkFilters.tsx`

**Port type:** Modified port — field names differ.

Thread `onClear` through to `GradeField` and `YearField`. Also add `reviewedStatus` for the
Abandoned-only filter (reviews and author-titles are always reviewed; "Not Reviewed" omitted):

```typescript
grade: {
  defaultValues?: [number, number];
  onChange: (values: [number, number]) => void;
  onClear?: () => void;
};
reviewedStatus: {
  defaultValues?: readonly string[];
  onChange: (values: string[]) => void;
  onClear?: () => void;
};
reviewYear: {
  defaultValues?: [string, string];
  onChange: (values: [string, string]) => void;
  onClear?: () => void;
  values: readonly string[];
};
```

Render `<ReviewedStatusFilter excludeNotReviewed>` (see §28).

No `FilterSection` wrapper at this level — `GradeField`, `YearField`, and `ReviewedStatusFilter`
each wrap themselves.

---

### 13. MODIFY: `src/components/fields/GradeField.tsx`

**Port type:** Direct port. The grade scale has been migrated to match the movie log's 2-16 range
(see § "Grade Scale Migration"). After migration the only difference is the `gradeToLetter` import
path (`~/utils/grades` in both).

**Changes from current book log GradeField:**

- Extend grade options to include F-, F, F+ at the low end.
- Change `min=1, max=13` → `min=2, max=16`.
- Change `handleClear` reset to `[2, 16]`.
- Add `onClear?: () => void` prop.
- Add `useEffect` to sync state from `defaultValues` (needed for chip removal).
- Add `handleSliderChange(from, to)`.
- Wrap return in `<FilterSection title={label}>`.
- Add `RangeSliderField` with `formatValue={gradeToLetter}`, `min={2}`, `max={16}`.
- Import `gradeToLetter` from `~/utils/grades`.

---

### 14. MODIFY: `src/components/fields/YearField.tsx`

**Port type:** Direct port. Logic is identical to the movie log's YearField.

**Changes:**

- Add `onClear?: () => void` prop.
- Add `useEffect` to sync from `defaultValues`/`years`.
- Add `handleSliderChange` with `findClosestYear`.
- Add `handleClear()`.
- Wrap return in `<FilterSection title={label}>`.
- Add `RangeSliderField` (no `formatValue`; numeric year labels are fine).
- Port `findClosestYear` function.

---

### 15. MODIFY: `src/components/filter-and-sort/CollectionFilters.tsx`

No changes needed. `TextField` now wraps itself in `FilterSection` (§8), so the name search
automatically becomes collapsible.

---

### 16. MODIFY: `src/components/filter-and-sort/WorkFilters.testHelper.ts`

Update `clickKindFilterOption` to click a checkbox:

```typescript
export async function clickKindFilterOption(
  user: UserEvent,
  value: string,
): Promise<void> {
  const checkbox = screen.getByRole("checkbox", { name: value });
  await user.click(checkbox);
}
```

Add `getKindFilter()` returning the kind `<fieldset>`.

---

### 17. MODIFY: `src/components/filter-and-sort/ReviewedWorkFilters.testHelper.ts`

`fillGradeFilter` and `fillReviewYearFilter` remain valid (dropdowns unchanged). Add a helper for
the new Abandoned status checkbox (used in reviews/author-titles feature specs):

```typescript
export async function clickAbandonedFilterOption(
  user: UserEvent,
): Promise<void> {
  await user.click(screen.getByRole("checkbox", { name: "Abandoned" }));
}
```

---

### 18. MODIFY: `src/components/filter-and-sort/FilterAndSortContainer.testHelper.ts`

Add:

```typescript
export async function clickSortRadioOption(
  user: UserEvent,
  value: string,
): Promise<void> {
  const radios = document.querySelectorAll<HTMLInputElement>(
    'input[type="radio"][name="sort"]',
  );
  const target = [...radios].find((r) => r.value === value);
  if (target) await user.click(target);
}
```

---

### 19. MODIFY: `src/components/filter-and-sort/FilterAndSortContainer.spec.tsx`

Add:

- `"mobile sort section"` describe block (7 tests — port from movie log spec).
- `"applied filters"` describe block (6 tests — port from movie log spec).

---

### 20. MODIFY: `src/reducers/filtersReducer.ts`

Add `removeAppliedFilter` action:

```typescript
type RemoveAppliedFilterAction = {
  id: string;
  type: "filters/removeAppliedFilter";
};

export function createRemoveAppliedFilterAction(
  id: string,
): RemoveAppliedFilterAction {
  return { type: "filters/removeAppliedFilter", id };
}
```

Base handler removes key `id` from both `activeFilterValues` and `pendingFilterValues`.

**AIDEV-NOTE:** Add: child reducers must override `removeAppliedFilter` for any array-valued
filter to remove a single item rather than the whole key.

Export `RemoveAppliedFilterAction` type and update `FiltersAction` union.

---

### 21. MODIFY: `src/reducers/titleFiltersReducer.ts`

**a) `kind` becomes `readonly string[]`:**

```typescript
export type TitleFiltersValues = {
  kind?: readonly string[]; // was: string
  title?: string;
  workYear?: [string, string];
};
```

Update `KindFilterChangedAction` → `values: readonly string[]`.
Handler: `kind: action.values.length === 0 ? undefined : action.values`.

**b) Override `removeAppliedFilter` for `kind-*` chips:**

```typescript
case "filters/removeAppliedFilter": {
  if (action.id.startsWith("kind-")) {
    const kindToRemove = action.id.slice("kind-".length);
    const current = state.activeFilterValues.kind ?? [];
    const updated = current.filter(
      (k) => k.toLowerCase().replaceAll(" ", "-") !== kindToRemove,
    );
    const newKind = updated.length === 0 ? undefined : (updated as readonly string[]);
    return {
      ...state,
      activeFilterValues: { ...state.activeFilterValues, kind: newKind },
      pendingFilterValues: { ...state.pendingFilterValues, kind: newKind },
    };
  }
  return filtersReducer(state, action);
}
```

Re-export `createRemoveAppliedFilterAction`.

---

### 22. MODIFY: `src/reducers/reviewedTitleFiltersReducer.ts`

**a) Add `reviewedStatus?: readonly string[]` to `ReviewedTitleFiltersValues`:**

```typescript
export type ReviewedTitleFiltersValues = TitleFiltersValues & {
  gradeValue?: [number, number];
  reviewedStatus?: readonly string[];
  reviewYear?: [string, string];
};
```

Add `ReviewedStatusFilterChangedAction`, `createReviewedStatusFilterChangedAction`, and handler
(same pattern as other array filters: sets to `undefined` when empty).

**b) Override `removeAppliedFilter`:**

- `"gradeValue"` and `"reviewYear"`: remove whole key from both active and pending (these are
  range tuples — removing the chip clears the entire range filter).
- `reviewedStatus-*`: remove individual item from the array (same pattern as `kind-*` in
  `titleFiltersReducer`). If the resulting array is empty, set to `undefined`.

Re-export `createRemoveAppliedFilterAction` and `createReviewedStatusFilterChangedAction`.

---

### 23. MODIFY: `src/reducers/collectionFiltersReducer.ts`

Override `removeAppliedFilter` for `"name"`. Re-export `createRemoveAppliedFilterAction`.

---

### 24. MODIFY: `src/filterers/filterTitles.ts`

```typescript
function createKindFilter<TValue extends FilterableTitle>(
  filterValue?: readonly string[],
) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) => filterValue.includes(value.kind);
}
```

---

### 25. MODIFY: `src/features/reading-log/ReadingLog.reducer.ts`

**a) `edition` → `readonly string[]`:** update action + handler + `removeAppliedFilter` for
`edition-*` chips.

**b) `reviewedStatus` → `readonly string[]`:** update action + handler + `removeAppliedFilter`
for `reviewedStatus-*` chips (remove individual item from array, same pattern as `kind-*`).

**c)** Re-export `createRemoveAppliedFilterAction`.

```typescript
export type ReadingLogFiltersValues = TitleFiltersValues & {
  edition?: readonly string[];
  readingYear?: [string, string];
  reviewedStatus?: readonly string[];
};
```

---

### 26. MODIFY: `src/features/reading-log/filterReadingLog.ts`

```typescript
function createEditionFilter(filterValue?: readonly string[]) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: ReadingLogValue) => filterValue.includes(value.edition);
}
function createKindFilter(filterValue?: readonly string[]) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: ReadingLogValue) => filterValue.includes(value.kind);
}
```

---

### 27. MODIFY: `src/filterers/createReviewedStatusFilter.ts`

Add `"Abandoned"` as a third status. Abandoned entries are identified by `abandoned: boolean` on
the value (a new field computed in the props layer). Expand the filterable shape:

```typescript
type FilterableMaybeReviewedTitle = {
  abandoned: boolean;
  reviewed?: boolean;
};

export function createReviewedStatusFilter<
  TValue extends FilterableMaybeReviewedTitle,
>(filterValue?: readonly string[]) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue): boolean => {
    let status: string;
    if (value.abandoned) {
      status = "Abandoned";
    } else {
      status = value.reviewed ? "Reviewed" : "Not Reviewed";
    }
    return filterValue.includes(status);
  };
}
```

**AIDEV-NOTE:** `abandoned: boolean` is a computed field added at the props layer (derived from
source data — e.g., `progress === "Abandoned"` in reading entries). The filter does not depend on
the raw `progress` string.

---

### 27b. MODIFY: `src/filterers/filterReviewedTitles.ts`

Add `reviewedStatus` filtering using `createReviewedStatusFilter`. Extend `FilterableReviewedTitle`
to include `abandoned: boolean` (computed at the props layer, not a raw data field):

```typescript
type FilterableReviewedTitle = FilterableTitle & {
  abandoned: boolean;
  gradeValue: number;
  reviewYear: string;
};
```

Apply the filter inside `filterReviewedTitles`. Also make `createGradeFilter` treat `[2, 16]`
(full range) as a no-op — without this, entries with `gradeValue=0` (Abandoned) would be
incorrectly excluded when the grade slider is at its cleared state:

```typescript
import { createReviewedStatusFilter } from "./createReviewedStatusFilter";

function createGradeFilter(filterValue?: [number, number]) {
  // AIDEV-NOTE: [2, 16] is the full range and must be treated as no-op, otherwise
  // Abandoned entries (gradeValue=0) are incorrectly excluded.
  if (!filterValue || (filterValue[0] === 2 && filterValue[1] === 16)) return;
  return (value: TValue): boolean =>
    value.gradeValue >= filterValue[0] && value.gradeValue <= filterValue[1];
}

// inside filterReviewedTitles:
const filters = [
  createGradeFilter(filterValues.gradeValue),
  createReviewYearFilter(filterValues.reviewYear),
  createReviewedStatusFilter(filterValues.reviewedStatus),
  ...extraFilters,
].filter((fn) => fn !== undefined);
```

**`abandoned` field sourcing:**

- `ReviewsValue` / `AuthorTitlesValue`: `abandoned = grade === "Abandoned"` (no `progress`
  field on these types; Abandoned is a grade string in the review data).
- `ReadingLogValue`: `abandoned = progress === "Abandoned"` (using existing `progress` field).

**Files to update:**

- `src/api/reviews.ts` — has a private `gradeToValue` at line ~280; replace with import from
  `~/utils/grades`. Also add `abandoned: boolean` to `Review` type (computed from `grade`).
- `src/features/author-titles/getAuthorTitlesProps.ts` — has a private `gradeToValue`; replace
  with import from `~/utils/grades`. Add `abandoned` to `AuthorTitlesValue`.
- `src/features/reading-log/ReadingLog.tsx` (the `ReadingLogValue` type) — add `abandoned:
boolean`. Populate in `getReadingLogProps.ts` from `progress === "Abandoned"`.

---

### 28. MODIFY: `src/components/filter-and-sort/ReviewedStatusFilter.tsx`

Convert from `SelectField` to `CheckboxListField` inside `<FilterSection title="Status">`.

Props become:

```typescript
{
  defaultValues?: readonly string[];
  excludeNotReviewed?: boolean;
  onChange: (values: string[]) => void;
  onClear?: () => void;
}
```

When `excludeNotReviewed={true}`, the "Not Reviewed" option is omitted — leaving "Reviewed" and
"Abandoned". Used by reviews and author-titles features (where all items are reviewed). Default
(`false`) shows all three options for ReadingLog.

Options (no meaningful counts):

```typescript
const allOptions = [
  { count: 0, label: "Reviewed", value: "Reviewed" },
  { count: 0, label: "Not Reviewed", value: "Not Reviewed" },
  { count: 0, label: "Abandoned", value: "Abandoned" },
];
const statusOptions = excludeNotReviewed
  ? allOptions.filter((o) => o.value !== "Not Reviewed")
  : allOptions;
```

`CheckboxListField` receives `statusOptions`.

Update `ReviewedStatusFilter.testHelper.ts`:

```typescript
export async function clickReviewedStatusFilterOption(
  user: UserEvent,
  status: string,
): Promise<void> {
  await user.click(screen.getByRole("checkbox", { name: status }));
}
```

---

### 29. MODIFY: `src/features/authors/Authors.tsx`

Rename `topNav` → `sideNav` in the `FilterAndSortContainer` call. Pass `AlphabetNav` via
`sideNav` instead of `topNav`. No other changes to the feature.

---

### 30. NEW: Per-Feature `buildAppliedFilterChips.ts`

Each function signature takes the active filter values plus distinct year arrays needed for
full-range detection:

```typescript
// reviews / author-titles:
buildAppliedFilterChips(
  values: ReviewedTitleFiltersValues,
  distinctWorkYears: readonly string[],
  distinctReviewYears: readonly string[],
): FilterChip[]

// reading-log:
buildAppliedFilterChips(
  values: ReadingLogFiltersValues,
  distinctWorkYears: readonly string[],
  distinctReadingYears: readonly string[],
): FilterChip[]
```

Year full-range = `[years[0], years[years.length - 1]]`. Omit year chip when
`values.workYear[0] === years[0] && values.workYear[1] === years[years.length - 1]`.

#### `src/features/reviews/buildAppliedFilterChips.ts`

| Filter key                  | Chip id                       | Category        | Label            | Omit when  |
| --------------------------- | ----------------------------- | --------------- | ---------------- | ---------- |
| `title`                     | `"title"`                     | `"Search"`      | title value      | —          |
| `kind[]` per item           | `"kind-${norm(k)}"`           | `"Kind"`        | kind value       | —          |
| `workYear`                  | `"workYear"`                  | `"Work Year"`   | `"1990 to 2000"` | full range |
| `gradeValue`                | `"gradeValue"`                | `"Grade"`       | `"F to A+"`      | `[2, 16]`  |
| `reviewYear`                | `"reviewYear"`                | `"Review Year"` | `"2010 to 2020"` | full range |
| `reviewedStatus[]` per item | `"reviewedStatus-${norm(s)}"` | `"Status"`      | status value     | —          |

Grade label: `gradeToLetter(min) + " to " + gradeToLetter(max)`.
Full grade range = `[2, 16]`.

#### `src/features/authors/buildAppliedFilterChips.ts`

`name` → `{ id: "name", category: "Search", label: name }`.

#### `src/features/author-titles/buildAppliedFilterChips.ts`

Same as reviews (includes `reviewedStatus`).

#### `src/features/reading-log/buildAppliedFilterChips.ts`

| Filter key                  | Chip id                       | Category         | Label         | Omit when  |
| --------------------------- | ----------------------------- | ---------------- | ------------- | ---------- |
| `title`                     | `"title"`                     | `"Search"`       | title value   | —          |
| `kind[]` per item           | `"kind-${norm(k)}"`           | `"Kind"`         | kind value    | —          |
| `edition[]` per item        | `"edition-${norm(e)}"`        | `"Edition"`      | edition value | —          |
| `workYear`                  | `"workYear"`                  | `"Work Year"`    | range string  | full range |
| `readingYear`               | `"readingYear"`               | `"Reading Year"` | range string  | full range |
| `reviewedStatus[]` per item | `"reviewedStatus-${norm(s)}"` | `"Status"`       | status value  | —          |

`norm(s)` = `s.toLowerCase().replaceAll(" ", "-")`.

---

### 31. MODIFY: Feature Filter Components

#### `ReviewsFilters.tsx` and `AuthorTitlesFilters.tsx`

- `kind.counts`: `Map<string, number>` from pending-filtered values.
- `kind.defaultValues`: from `state.pendingFilterValues.kind`.
- `kind.onClear`: dispatch `createKindFilterChangedAction([])`.
- `grade.onClear`: dispatch `createGradeFilterChangedAction([2, 16])` (full range after migration).
- `reviewYear.onClear`: dispatch `createReviewYearFilterChangedAction` with full range.
- `reviewedStatus.defaultValues`: from `state.pendingFilterValues.reviewedStatus`.
- `reviewedStatus.onChange`: dispatch `createReviewedStatusFilterChangedAction`.
- `reviewedStatus.onClear`: dispatch `createReviewedStatusFilterChangedAction([])`.

`ReviewedWorkFilters` renders `<ReviewedStatusFilter excludeNotReviewed ...>`.

#### `ReadingLogFilters.tsx`

- Edition: `CheckboxListField` inside `<FilterSection title="Edition">`.
- Pass `edition.counts`, `edition.defaultValues`, `edition.onClear`.
- Pass `kind.counts`, `kind.defaultValues`, `kind.onClear`.
- Updated `ReviewedStatusFilter` (§28) used as-is; pass `defaultValues`, `onChange`, `onClear`.

#### `AuthorsFilters.tsx`

No changes (name-only, no kind/grade).

---

### 32. MODIFY: Feature Main Components

Each of the four features (`Reviews.tsx`, `Authors.tsx`, `AuthorTitles.tsx`, `ReadingLog.tsx`):

1. Build `activeFilters = buildAppliedFilterChips(state.activeFilterValues, ...)`.
2. Pass `activeFilters` and `onRemoveFilter={(id) => dispatch(createRemoveAppliedFilterAction(id))}` to `FilterAndSortContainer`.
3. Pass `onClearAll={() => { dispatch(createClearFiltersAction()); dispatch(createApplyFiltersAction()); }}` to `FilterAndSortContainer` for forwarding to `AppliedFilters`. This clears both pending and active immediately.

**Note:** `activeFilters` derives from `state.activeFilterValues` (committed filters only).
`onClearAll` also resets `selectedMonthDate` in ReadingLog (via `filters/applied`).

---

### 33. MODIFY: Feature Reducer Modules

Re-export `createRemoveAppliedFilterAction` from each feature's reducer module:

- `Reviews.reducer.ts` (from `reviewedTitleFiltersReducer`)
- `Authors.reducer.ts` (from `collectionFiltersReducer`)
- `AuthorTitles.reducer.ts` (from `reviewedTitleFiltersReducer`)
- `ReadingLog.reducer.ts` (already local)

---

### 34. MODIFY: Feature Spec Files

All four feature specs:

1. Kind/edition filter tests: click checkboxes; add multi-select (OR logic) test.
2. ReviewedStatus tests (ReadingLog): click "Reviewed", "Not Reviewed", "Abandoned" checkboxes.
3. Abandoned filter tests (Reviews, AuthorTitles): click "Abandoned" checkbox; verify only
   abandoned entries shown.
4. Applied filter chip tests: apply filter → open drawer → chips visible; × removes immediately.
5. Update all snapshots.

---

## Grade Scale Migration

**Context:** The book log currently uses a 1-12 numeric scale (F=1 to A=12, no A+). To enable a
direct port of `GradeField` and to support F+/F-/A+ grades, the scale is migrated to match the
movie log's 2-16 range (F-=2 to A+=16). `Abandoned` entries have `gradeValue=0` and are not part
of the grade slider range; they are filtered separately via `ReviewedStatusFilter` (see §28).

**New mapping:**

```
A+ = 16, A = 15, A- = 14
B+ = 13, B = 12, B- = 11
C+ = 10, C =  9, C- =  8
D+ =  7, D =  6, D- =  5
F+ =  4, F =  3, F- =  2
Abandoned = 0 (not in grade filter range; filtered via ReviewedStatusFilter)
```

**Files requiring grade mapping updates:**

- `src/utils/grades.ts` (new — exports `gradeToLetter` and `gradeToValue` using 2-16 scale)
- `src/api/reviews.ts` — has a private `gradeToValue` at line ~280 (old scale F=1 to A=12);
  replace with `import { gradeToValue } from "~/utils/grades"`. Also add `abandoned: boolean`
  to the `Review` type, computed as `grade === "Abandoned"`.
- `src/features/author-titles/getAuthorTitlesProps.ts` — has a private `gradeToValue` (old
  scale); replace with import from `~/utils/grades`. Add `abandoned` to `AuthorTitlesValue`.
- `buildAppliedFilterChips` for reviews/author-titles: full range = `[2, 16]`
- `GradeField.tsx`: `min=2`, `max=16`, clear resets to `[2, 16]`
- Any spec fixtures that hardcode numeric grade values

**Data files are NOT affected** — grades are stored as letter strings (e.g., `"A"`, `"B+"`, `"F"`)
in JSON. Only runtime computations change.

**Note on F+/F-:** These grades may not appear in existing review data. The filter options will
include them but they will match no reviews until they are used in new reviews.

---

## Chip ID Conventions

| Filter                     | Chip ID format                                             | Example                         |
| -------------------------- | ---------------------------------------------------------- | ------------------------------- |
| Title/name search          | `"title"` / `"name"`                                       | `"title"`                       |
| Kind (per item)            | `"kind-${k.toLowerCase().replaceAll(' ', '-')}"`           | `"kind-novel"`                  |
| Edition (per item)         | `"edition-${e.toLowerCase().replaceAll(' ', '-')}"`        | `"edition-ebook"`               |
| Reviewed Status (per item) | `"reviewedStatus-${s.toLowerCase().replaceAll(' ', '-')}"` | `"reviewedStatus-not-reviewed"` |
| Work Year range            | `"workYear"`                                               | `"workYear"`                    |
| Grade range                | `"gradeValue"`                                             | `"gradeValue"`                  |
| Review Year range          | `"reviewYear"`                                             | `"reviewYear"`                  |
| Reading Year range         | `"readingYear"`                                            | `"readingYear"`                 |

---

## What Is NOT Changed

- `ReviewedWorkSortOptions.tsx`, `CollectionSortOptions.tsx` — sort option lists, unchanged.
- Astro pages (`.astro` files) — no changes; all filter/sort logic is in React components.
- `getProps` functions — data loading unchanged (except grade mapping, see § Grade Scale Migration).
- Sort logic (`sortReviews.ts`, etc.) — unchanged.
- `usePaginatedGroupedValues`, `useGroupedValues`, `useFilteredValues` hooks — unchanged.
- `SelectField.tsx` — no longer used for kind/edition/reviewedStatus after this change, but the
  component itself is not deleted (may be used elsewhere; run `knip` to confirm).

---

## Testing Requirements

- Every new `.tsx` component has a corresponding `.spec.tsx`.
- `FilterSection.spec.tsx`, `AppliedFilters.spec.tsx`: direct port from movie log.
- `RangeSliderField.spec.tsx`: direct port from movie log.
- `FilterAndSortContainer.spec.tsx`: port mobile sort and applied-filters test groups.
- Feature specs: update kind/edition/reviewedStatus filter tests for checkboxes; add applied-filter
  chip tests; update all snapshots.
- Run with `--max-workers=2`.
