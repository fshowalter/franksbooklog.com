import { SelectField } from "~/components/SelectField";
import { SelectOptions } from "~/components/SelectOptions";
import { WorkFilters } from "~/components/WorkFilters";
import { YearField } from "~/components/YearField";

import type { ActionType, ReadingsFilterValues } from "./Readings.reducer";

import { Actions } from "./Readings.reducer";

export function Filters({
  dispatch,
  distinctEditions,
  distinctKinds,
  distinctReadingYears,
  distinctWorkYears,
  filterValues,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctEditions: readonly string[];
  distinctKinds: readonly string[];
  distinctReadingYears: readonly string[];
  distinctWorkYears: readonly string[];
  filterValues: ReadingsFilterValues;
}): React.JSX.Element {
  return (
    <>
      <WorkFilters
        kind={{
          initialValue: filterValues.kind,
          onChange: (value) =>
            dispatch({
              type: Actions.PENDING_FILTER_KIND,
              value,
            }),
          values: distinctKinds,
        }}
        title={{
          initialValue: filterValues.title,
          onChange: (value) =>
            dispatch({ type: Actions.PENDING_FILTER_TITLE, value }),
        }}
        workYear={{
          initialValue: filterValues.workYear,
          onChange: (values) =>
            dispatch({ type: Actions.PENDING_FILTER_WORK_YEAR, values }),
          values: distinctWorkYears,
        }}
      />
      <YearField
        initialValues={filterValues.readingYear}
        label="Reading Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.PENDING_FILTER_READING_YEAR, values })
        }
        years={distinctReadingYears}
      />
      <SelectField
        initialValue={filterValues.edition}
        label="Edition"
        onChange={(value) =>
          dispatch({
            type: Actions.PENDING_FILTER_EDITION,
            value,
          })
        }
      >
        <SelectOptions options={distinctEditions} />
      </SelectField>
    </>
  );
}
