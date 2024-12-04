import type { JSX } from "react";

import { DebouncedInput } from "~/components/DebouncedInput";
import { SelectField } from "~/components/SelectField";
import { SelectOptions } from "~/components/SelectOptions";
import { YearInput } from "~/components/YearInput";

import type { ActionType, Sort } from "./Readings.reducer";

import { Actions } from "./Readings.reducer";

export function Filters({
  dispatch,
  distinctEditions,
  distinctKinds,
  distinctReadingYears,
  distinctWorkYears,
  sortValue,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctEditions: readonly string[];
  distinctKinds: readonly string[];
  distinctReadingYears: readonly string[];
  distinctWorkYears: readonly string[];
  sortValue: Sort;
}): JSX.Element {
  return (
    <>
      <DebouncedInput
        label="Title"
        onInputChange={(value) =>
          dispatch({ type: Actions.FILTER_TITLE, value })
        }
        placeholder="Enter all or part of a title"
      />
      <YearInput
        label="Work Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.FILTER_PUBLISHED_YEAR, values })
        }
        years={distinctWorkYears}
      />
      <YearInput
        label="Reading Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.FILTER_READING_YEAR, values })
        }
        years={distinctReadingYears}
      />
      <SelectField
        label="Kind"
        onChange={(e) =>
          dispatch({
            type: Actions.FILTER_KIND,
            value: e.target.value,
          })
        }
      >
        <SelectOptions options={distinctKinds} />
      </SelectField>
      <SelectField
        label="Edition"
        onChange={(e) =>
          dispatch({
            type: Actions.FILTER_EDITION,
            value: e.target.value,
          })
        }
      >
        <SelectOptions options={distinctEditions} />
      </SelectField>
      <SelectField
        label="Order By"
        onChange={(e) =>
          dispatch({
            type: Actions.SORT,
            value: e.target.value as Sort,
          })
        }
        value={sortValue}
      >
        <option value="progress-date-desc">Reading Date (Newest First)</option>
        <option value="progress-date-asc">Reading Date (Oldest First)</option>
      </SelectField>
    </>
  );
}
