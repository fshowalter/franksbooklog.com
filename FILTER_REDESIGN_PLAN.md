# Filter & Sort Redesign — Implementation Plan

Reference spec: `FILTER_REDESIGN_SPEC.md`
Reference repo: `../franksmovielog.com/src/`

---

## Stage 1: Foundation — New Shared Components

**Goal:** Create the five new reusable building blocks. No feature code changes yet.
**Success Criteria:** `npm test -- --max-workers=2` passes; new component specs pass; no regressions.

### Tasks

1. **Create `src/components/filter-and-sort/FilterSection.tsx`**
   - Direct port from `franksmovielog.com/src/components/filter-and-sort/FilterSection.tsx`.
   - Keep all `AIDEV-NOTE` comments.

2. **Create `src/components/filter-and-sort/FilterSection.spec.tsx`**
   - Direct port from movie log.

3. **Create `src/components/filter-and-sort/AppliedFilters.tsx`**
   - Direct port from `franksmovielog.com/src/components/filter-and-sort/AppliedFilters.tsx`.
   - Imports `FilterSection`.

4. **Create `src/components/filter-and-sort/AppliedFilters.spec.tsx`**
   - Direct port from movie log.

5. **Create `src/components/fields/CheckboxListField.tsx`**
   - Direct port from `franksmovielog.com/src/components/fields/CheckboxListField.tsx`.

6. **Create `src/components/fields/RangeSliderField.tsx`**
   - Direct port from `franksmovielog.com/src/components/fields/RangeSliderField.tsx`.

7. **Create `src/components/fields/RangeSliderField.spec.tsx`**
   - Direct port from movie log.

8. **Create `src/utils/grades.ts`**
   - Direct port from movie log: `gradeToLetter(value: number): string` using the 2–16 scale
     (F-=2 to A+=16). Both codebases share the same scale after the grade scale migration.

**Status:** Complete

---

## Stage 2: Field Updates (GradeField, YearField)

**Goal:** Update `GradeField` and `YearField` to add `FilterSection` wrappers, `RangeSliderField`,
`onClear` callbacks, and `useEffect` state sync. Port `TextField`, `FilterAndSortContainer`, and
`FilterAndSortHeader` from the movie log.

**Success Criteria:** Lint and type-check pass. FilterAndSortContainer spec passes including new
mobile sort and applied filters groups. Feature snapshot updates regenerated.

### Tasks

1. **Modify `src/components/fields/GradeField.tsx`**
   - Direct port from movie log. Grade scale migrated to 2–16 (F-=2 to A+=16).
   - `min=2`, `max=16`, `handleClear` resets to `[2, 16]`.
   - Import `gradeToLetter` from `~/utils/grades`.

2. **Modify `src/components/fields/YearField.tsx`**
   - Add `onClear?: () => void` prop.
   - Add `useEffect` to sync from `defaultValues`/`years`.
   - Add `handleSliderChange` with `findClosestYear`.
   - Add `handleClear()`.
   - Wrap return in `<FilterSection title={label}>`.
   - Add `RangeSliderField` with numeric year values.
   - Port `findClosestYear` function from movie log.

3. **Modify `src/components/filter-and-sort/FilterAndSortContainer.tsx`**
   - Add `activeFilters?: FilterChip[]` and `onRemoveFilter?: (id: string) => void` props.
   - Add `suppressSortScrollRef`.
   - Add `AppliedFilters` (conditional) + mobile sort radio section to the drawer.
   - Update "View Results" handler to read sort radio and call `sortProps.onSortChange`.
   - Import `AppliedFilters`, `FilterSection`.

4. **Modify `src/components/filter-and-sort/FilterAndSortHeader.tsx`**
   - Direct port from movie log. Replaces file entirely.

5. **Extend `src/components/filter-and-sort/FilterAndSortContainer.spec.tsx`**
   - Add `"mobile sort section"` describe block (7 tests).
   - Add `"applied filters"` describe block (6 tests).

6. **Update `src/components/filter-and-sort/FilterAndSortContainer.testHelper.ts`**
   - Add `clickSortRadioOption(user, value)`.

7. **Run `npm run test:update -- --max-workers=2`** to regenerate snapshots for any feature specs
   that snapshot the FilterAndSortContainer output.

**Status:** Not Started

---

## Stage 3: Reducer Layer

**Goal:** Extend the reducer chain with `removeAppliedFilter`; convert `kind`, `edition`, and
`reviewedStatus` from `string` to `readonly string[]`.

**Success Criteria:** `npm run check` passes with no TypeScript errors. All tests pass.

### Tasks

1. **Modify `src/reducers/filtersReducer.ts`**
   - Add `RemoveAppliedFilterAction` to the `FiltersAction` union.
   - Add `createRemoveAppliedFilterAction(id)` action creator.
   - Add `case "filters/removeAppliedFilter"` base handler (removes whole key).
   - Export type and add `AIDEV-NOTE` about child reducer overrides.

2. **Modify `src/reducers/titleFiltersReducer.ts`**
   - Change `TitleFiltersValues.kind` from `string` to `readonly string[]`.
   - Update `KindFilterChangedAction` and `createKindFilterChangedAction`.
   - Add `removeAppliedFilter` override for `kind-*` chip IDs.
   - Re-export `createRemoveAppliedFilterAction`.

3. **Modify `src/reducers/reviewedTitleFiltersReducer.ts`**
   - Add `reviewedStatus?: readonly string[]` to `ReviewedTitleFiltersValues`.
   - Add `ReviewedStatusFilterChangedAction`, `createReviewedStatusFilterChangedAction`, handler.
   - Add `removeAppliedFilter` overrides for `"gradeValue"`, `"reviewYear"`, `reviewedStatus-*`.
   - Re-export `createRemoveAppliedFilterAction` and `createReviewedStatusFilterChangedAction`.

4. **Modify `src/reducers/collectionFiltersReducer.ts`**
   - Add `removeAppliedFilter` override for `"name"` ID.
   - Re-export `createRemoveAppliedFilterAction`.

5. **Modify `src/features/reading-log/ReadingLog.reducer.ts`**
   - Change `edition` from `string` to `readonly string[]`; update action + handler.
   - Change `reviewedStatus` from `string` to `readonly string[]`; update action + handler.
   - Add `removeAppliedFilter` overrides for `edition-*` and `reviewedStatus-*` chip IDs.
   - Re-export `createRemoveAppliedFilterAction`.

6. **Modify `src/filterers/filterTitles.ts`**
   - `createKindFilter`: `string` → `readonly string[]`; use `filterValue.includes(value.kind)`.

7. **Modify `src/features/reading-log/filterReadingLog.ts`**
   - `createEditionFilter`: `string` → `readonly string[]`.
   - `createKindFilter` (local): `string` → `readonly string[]`.

8. **Modify `src/filterers/createReviewedStatusFilter.ts`**
   - `filterValue?: string` → `filterValue?: readonly string[]`.
   - Add `abandoned: boolean` to `FilterableMaybeReviewedTitle`.
   - Filter logic: check `value.abandoned` for `"Abandoned"`; otherwise use `value.reviewed`.

9. **Modify `src/filterers/filterReviewedTitles.ts`**
   - Add `abandoned: boolean` to `FilterableReviewedTitle`.
   - Apply `createReviewedStatusFilter(filterValues.reviewedStatus)`.
   - Make `createGradeFilter` treat `[2, 16]` as no-op (else abandoned entries excluded).
   - Add `abandoned: boolean` to `ReviewsValue`, `AuthorTitlesValue`, `ReadingLogValue`.
   - `src/api/reviews.ts`: replace private `gradeToValue` with `~/utils/grades` import; add
     `abandoned: boolean` to `Review` type (`grade === "Abandoned"`).
   - `getAuthorTitlesProps.ts`: same — replace private `gradeToValue`; add `abandoned`.
   - `getReadingLogProps.ts`: add `abandoned: boolean` to `ReadingLogValue` (`progress === "Abandoned"`).

10. **Run `npm run check`** — fix TypeScript cascade from type changes.

11. **Run `npm test -- --max-workers=2`** — fix test failures. Focus on reducer and filterer tests.

**Status:** Not Started

---

## Stage 4: Filter Component Updates

**Goal:** Update `WorkFilters` (kind → CheckboxListField), `ReviewedWorkFilters` (onClear + Abandoned
status), `ReviewedStatusFilter` (→ CheckboxListField with configurable options), and feature
filter wrapper components.

**Success Criteria:** Lint and check pass. Tests pass (update snapshots). Kind and edition
interact as multi-select in feature specs.

### Tasks

1. **Modify `src/components/filter-and-sort/WorkFilters.tsx`**
   - Update `kind` prop type (counts, defaultValues as array, onChange as array, onClear).
   - Replace `SelectField` with `CheckboxListField` inside `<FilterSection title="Kind">`.
   - Remove `SelectField` import; add `CheckboxListField` and `FilterSection` imports.

2. **Modify `src/components/filter-and-sort/WorkFilters.testHelper.ts`**
   - Update `clickKindFilterOption` to click by checkbox role.
   - Add `getKindFilter()` for the fieldset.

3. **Modify `src/components/filter-and-sort/ReviewedWorkFilters.tsx`**
   - Thread `grade.onClear` and `reviewYear.onClear` through to `GradeField`/`YearField`.
   - Add `reviewedStatus` prop; render `<ReviewedStatusFilter excludeNotReviewed>`.

4. **Modify `src/components/filter-and-sort/ReviewedStatusFilter.tsx`**
   - Convert from `SelectField` to `CheckboxListField` inside `<FilterSection title="Status">`.
   - Props change: `defaultValues?: readonly string[]`, `onChange: (values: string[]) => void`,
     `onClear?: () => void`, `excludeNotReviewed?: boolean` (hides "Not Reviewed").

5. **Modify `src/components/filter-and-sort/ReviewedStatusFilter.testHelper.ts`**
   - Update `clickReviewedStatusFilterOption` to click a checkbox by label.

6. **Modify `src/features/reviews/ReviewsFilters.tsx`**
   - Pass `kind.counts` (computed from pending-filtered values), `kind.defaultValues`,
     `kind.onClear`.
   - Pass `grade.onClear` and `reviewYear.onClear`.
   - Pass `reviewedStatus.defaultValues`, `reviewedStatus.onChange`, `reviewedStatus.onClear`.

7. **Modify `src/features/author-titles/AuthorTitlesFilters.tsx`**
   - Same as ReviewsFilters.

8. **Modify `src/features/reading-log/ReadingLogFilters.tsx`**
   - Replace edition `SelectField` with `CheckboxListField` inside `<FilterSection title="Edition">`.
   - Pass edition counts, defaultValues, onClear.
   - Pass kind counts, onClear.
   - Update `reviewedStatus` to use updated `ReviewedStatusFilter` (passes `onClear`).

9. **Run `npm run lint && npm run check`.**

10. **Run `npm run test:update -- --max-workers=2`** — regenerate snapshots.

**Status:** Not Started

---

## Stage 5: Applied Filters Integration

**Goal:** Wire `buildAppliedFilterChips` and `onRemoveFilter` into all four feature main
components.

**Success Criteria:** Opening filter drawer with active filters shows chip section. Clicking × on
a chip removes that filter immediately. Tests pass.

### Tasks

1. **Create `src/features/reviews/buildAppliedFilterChips.ts`**
   - Builds `FilterChip[]` from `ReviewsFiltersValues` + distinct year arrays.
   - Grade label via `gradeToLetter`; full-range detection for work year, grade, review year.

2. **Modify `src/features/reviews/Reviews.tsx`**
   - Import `buildAppliedFilterChips` and `createRemoveAppliedFilterAction`.
   - Compute `activeFilters` from `state.activeFilterValues` + distinct year props.
   - Pass `activeFilters`, `onRemoveFilter`, and `onClearAll` to `FilterAndSortContainer`.
   - `onClearAll`: `() => { dispatch(createClearFiltersAction()); dispatch(createApplyFiltersAction()); }`

3. **Create `src/features/authors/buildAppliedFilterChips.ts`**
   - Handles `name` only.

4. **Modify `src/features/authors/Authors.tsx`**
   - Same pattern as Reviews.

5. **Create `src/features/author-titles/buildAppliedFilterChips.ts`**
   - Same as Reviews (ReviewedTitleFiltersValues).

6. **Modify `src/features/author-titles/AuthorTitles.tsx`**
   - Same pattern as Reviews.

7. **Create `src/features/reading-log/buildAppliedFilterChips.ts`**
   - Handles: title, kind[], edition[], workYear, readingYear, reviewedStatus[].

8. **Modify `src/features/reading-log/ReadingLog.tsx`**
   - Same pattern as Reviews.

9. **Run `npm test -- --max-workers=2`** — fix any remaining failures.

**Status:** Not Started

---

## Stage 6: Test Coverage

**Goal:** Comprehensive test coverage for new behaviour in feature spec files.
**Success Criteria:** Full suite passes. Snapshots committed. All lint/check/format/knip clean.

### Tasks

1. **Update `src/features/reviews/Reviews.spec.tsx`**
   - Kind filter tests: click checkboxes, test multi-select (inclusive OR).
   - Applied-filter chip tests: apply filter → open drawer → chips visible; click × → removed.
   - Snapshot updates.

2. **Update `src/features/authors/Authors.spec.tsx`**
   - Applied filter chip test for name search.
   - Snapshot updates.

3. **Update `src/features/author-titles/AuthorTitles.spec.tsx`**
   - Kind multiselect, grade chip, applied filters.
   - Snapshot updates.

4. **Update `src/features/reading-log/ReadingLog.spec.tsx`**
   - Edition filter: multi-select checkboxes.
   - Reviewed status: multi-select checkboxes ("Reviewed" / "Not Reviewed" / "Abandoned").
   - Kind filter: multi-select.
   - Applied filter chips for all.
   - Snapshot updates.

5. **Run full suite:**
   ```bash
   npm test -- --max-workers=2
   npm run lint
   npm run check
   npm run format
   npm run knip
   npm run lint:spelling
   ```

6. **Fix any knip warnings** — new utilities and components should be imported; verify no dead
   exports from old single-select `kind`/`edition` patterns.

**Status:** Not Started

---

## Completion Checklist

- [ ] Stage 1: FilterSection, AppliedFilters, CheckboxListField, RangeSliderField, grades utility
- [ ] Stage 2: GradeField/YearField upgraded; FilterAndSortContainer/Header updated; new tests pass
- [ ] Stage 3: Reducers + filterers updated; TypeScript clean; tests pass
- [ ] Stage 4: WorkFilters uses CheckboxListField; ReviewedStatusFilter converted; all filter components updated
- [ ] Stage 5: All four features show applied filter chips and support chip removal
- [ ] Stage 6: Full test suite passes; snapshots committed; lint/check/format/knip/spelling clean
- [ ] Delete `FILTER_REDESIGN_SPEC.md` and `FILTER_REDESIGN_PLAN.md`

---

## Risk Notes

- **Grade scale migration (Stage 1+2):** The book log currently uses 1–12 (F=1 to A=12, no A+);
  the new scale is 2–16 (F-=2 to A+=16). Two private `gradeToValue` functions exist — one in
  `src/api/reviews.ts`, one in `getAuthorTitlesProps.ts` — both must be replaced with the shared
  `gradeToValue` from `~/utils/grades`. Run `grep -r "gradeToValue" src/` to find all copies.
- **TypeScript propagation (Stage 3):** Changing `kind`/`edition`/`reviewedStatus` from `string`
  to `readonly string[]` cascades through filterers, reducers, and feature components. Run
  `npm run check` frequently during Stage 3.
- **Snapshot churn:** Every feature snapshot changes in Stage 2 (new drawer markup) and again in
  Stage 4 (new filter controls). Run `npm run test:update` at the end of each stage.
- **Applied Filters timing (Stage 5):** Chips derive from `state.activeFilterValues` (after "View
  Results"), NOT `pendingFilterValues`. Verify this in the feature component implementations.
- **ReadingLog `selectedMonthDate`:** Ensure that `removeAppliedFilter` actions do NOT reset
  `selectedMonthDate`. Only `filters/applied` and `sort/sort` reset it.
- **Kind counts pattern:** Compute counts from the currently pending-filtered result set (not all
  values), so the count shown next to each kind reflects the current filter context. Review how
  the movie log's `ReviewsFilters.tsx` computes genre counts for the reference implementation.
- **`suppressSortScrollRef` timing (Stage 2):** The mobile sort + scroll suppression requires care.
  Test via the new `"mobile sort section"` group in `FilterAndSortContainer.spec.tsx`.
