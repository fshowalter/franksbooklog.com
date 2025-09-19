import { SelectField } from "~/components/fields/SelectField";
import { SelectOptions } from "~/components/fields/SelectOptions";
import { YearField } from "~/components/fields/YearField";
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
}: {
  dispatch: React.Dispatch<ReadingLogAction>;
  distinctEditions: readonly string[];
  distinctKinds: readonly string[];
  distinctReadingYears: readonly string[];
  distinctWorkYears: readonly string[];
  filterValues: ReadingLogFiltersValues;
}): React.JSX.Element {
  return (
    <>
      <WorkFilters
        kind={{
          defaultValue: filterValues.kind,
          onChange: (value) => dispatch(createKindFilterChangedAction(value)),
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
        defaultValue={filterValues.reviewedStatus}
        onChange={(value) =>
          dispatch(createReviewedStatusFilterChangedAction(value))
        }
      />
      <YearField
        defaultValues={filterValues.readingYear}
        label="Reading Year"
        onYearChange={(values) =>
          dispatch(createReadingYearFilterChangedAction(values))
        }
        years={distinctReadingYears}
      />
      <SelectField
        defaultValue={filterValues.edition}
        label="Edition"
        onChange={(value) => dispatch(createEditionFilterChangedAction(value))}
      >
        <SelectOptions options={distinctEditions} />
      </SelectField>
    </>
  );
}
