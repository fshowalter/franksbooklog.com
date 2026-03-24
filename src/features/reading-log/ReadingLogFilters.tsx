import { CheckboxListField } from "~/components/react/fields/CheckboxListField";
import { YearField } from "~/components/react/fields/YearField";
import { ReviewedStatusFilter } from "~/components/react/reviewed-status-filter/ReviewedStatusFilter";
import { WorkFilters } from "~/components/react/work-filters/WorkFilters";

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
  editionCounts,
  filterValues,
  kindCounts,
  reviewedStatusCounts,
}: {
  dispatch: React.Dispatch<ReadingLogAction>;
  distinctEditions: readonly string[];
  distinctKinds: readonly string[];
  distinctReadingYears: readonly string[];
  distinctWorkYears: readonly string[];
  editionCounts?: Map<string, number>;
  filterValues: ReadingLogFiltersValues;
  kindCounts?: Map<string, number>;
  reviewedStatusCounts?: Map<string, number>;
}): React.JSX.Element {
  return (
    <>
      <WorkFilters
        kind={{
          counts: kindCounts,
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
            dispatch(
              createWorkYearFilterChangedAction(
                values,
                distinctWorkYears[0] ?? "",
                distinctWorkYears.at(-1) ?? "",
              ),
            ),
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
          dispatch(
            createReadingYearFilterChangedAction(
              values,
              distinctReadingYears[0] ?? "",
              distinctReadingYears.at(-1) ?? "",
            ),
          )
        }
        years={distinctReadingYears}
      />
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
            count: editionCounts?.get(e) ?? 0,
            label: e,
            value: e,
          }))}
      />
    </>
  );
}
