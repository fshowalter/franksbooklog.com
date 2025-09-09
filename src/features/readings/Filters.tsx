import { SelectField } from "~/components/fields/SelectField";
import { SelectOptions } from "~/components/fields/SelectOptions";
import { YearField } from "~/components/fields/YearField";
import { WorkFilters } from "~/components/filter-and-sort/WorkFilters";

import type {
  ReadingsActionType,
  ReadingsFiltersValues,
} from "./Readings.reducer";

import {
  createSetEditionPendingFilterAction,
  createSetKindPendingFilterAction,
  createSetReadingYearPendingFilterAction,
  createSetTitlePendingFilterAction,
  createSetWorkYearPendingFilterAction,
} from "./Readings.reducer";

export function Filters({
  dispatch,
  distinctEditions,
  distinctKinds,
  distinctReadingYears,
  distinctWorkYears,
  filterValues,
}: {
  dispatch: React.Dispatch<ReadingsActionType>;
  distinctEditions: readonly string[];
  distinctKinds: readonly string[];
  distinctReadingYears: readonly string[];
  distinctWorkYears: readonly string[];
  filterValues: ReadingsFiltersValues;
}): React.JSX.Element {
  return (
    <>
      <WorkFilters
        kind={{
          initialValue: filterValues.kind,
          onChange: (value) =>
            dispatch(createSetKindPendingFilterAction(value)),
          values: distinctKinds,
        }}
        title={{
          initialValue: filterValues.title,
          onChange: (value) =>
            dispatch(createSetTitlePendingFilterAction(value)),
        }}
        workYear={{
          initialValue: filterValues.workYear,
          onChange: (values) =>
            dispatch(createSetWorkYearPendingFilterAction(values)),
          values: distinctWorkYears,
        }}
      />
      <YearField
        initialValues={filterValues.readingYear}
        label="Reading Year"
        onYearChange={(values) =>
          dispatch(createSetReadingYearPendingFilterAction(values))
        }
        years={distinctReadingYears}
      />
      <SelectField
        initialValue={filterValues.edition}
        label="Edition"
        onChange={(value) =>
          dispatch(createSetEditionPendingFilterAction(value))
        }
      >
        <SelectOptions options={distinctEditions} />
      </SelectField>
    </>
  );
}
