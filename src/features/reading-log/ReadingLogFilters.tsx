import { CheckboxListField } from "~/components/fields/CheckboxListField";
import { YearField } from "~/components/fields/YearField";
import { FilterSection } from "~/components/filter-and-sort/FilterSection";
import { ReviewedStatusFilter } from "~/components/filter-and-sort/ReviewedStatusFilter";
import { WorkFilters } from "~/components/filter-and-sort/WorkFilters";

import type {
  ReadingLogAction,
  ReadingLogFiltersValues,
} from "./ReadingLog.reducer";

import {
  createEditionFilterChangedAction,
  createKindFilterChangedAction,
  createReadingYearFilterChangedAction,
  createReviewedStatusFilterChangedAction,
  createTitleFilterChangedAction,
  createWorkYearFilterChangedAction,
} from "./ReadingLog.reducer";

export function Filters({
  dispatch,
  distinctEditions,
  distinctKinds,
  distinctReadingYears,
  distinctWorkYears,
  filterValues,
  reviewedStatusCounts,
}: {
  dispatch: React.Dispatch<ReadingLogAction>;
  distinctEditions: readonly string[];
  distinctKinds: readonly string[];
  distinctReadingYears: readonly string[];
  distinctWorkYears: readonly string[];
  filterValues: ReadingLogFiltersValues;
  reviewedStatusCounts?: Map<string, number>;
}): React.JSX.Element {
  return (
    <>
      <WorkFilters
        kind={{
          defaultValues: filterValues.kind,
          onChange: (values) => dispatch(createKindFilterChangedAction(values)),
          onClear: () => dispatch(createKindFilterChangedAction([])),
          values: distinctKinds,
        }}
        title={{
          defaultValue: filterValues.title,
          onChange: (value) => dispatch(createTitleFilterChangedAction(value)),
        }}
        workYear={{
          defaultValues: filterValues.workYear,
          onChange: (values) =>
            dispatch(createWorkYearFilterChangedAction(values)),
          values: distinctWorkYears,
        }}
      />
      <ReviewedStatusFilter
        counts={reviewedStatusCounts}
        defaultValues={filterValues.reviewedStatus}
        onChange={(values) =>
          dispatch(createReviewedStatusFilterChangedAction(values))
        }
        onClear={() => dispatch(createReviewedStatusFilterChangedAction([]))}
      />
      <YearField
        defaultValues={filterValues.readingYear}
        label="Reading Year"
        onYearChange={(values) =>
          dispatch(createReadingYearFilterChangedAction(values))
        }
        years={distinctReadingYears}
      />
      <FilterSection title="Edition">
        <CheckboxListField
          defaultValues={filterValues.edition}
          label="Edition"
          onChange={(values) =>
            dispatch(createEditionFilterChangedAction(values))
          }
          onClear={() => dispatch(createEditionFilterChangedAction([]))}
          options={distinctEditions
            .filter((e) => e !== "All")
            .map((e) => ({
              count: 0,
              label: e,
              value: e,
            }))}
        />
      </FilterSection>
    </>
  );
}
