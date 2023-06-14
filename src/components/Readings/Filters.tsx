import { DebouncedInput } from "../DebouncedInput";
import { SelectField, SelectOptions } from "../SelectField";
import { YearInput } from "../YearInput";

import { Action, ActionType, Sort } from "./Readings.reducer";

export function Filters({
  dispatch,
  distinctPublishedYears,
  distinctReadingYears,
  distinctKinds,
  distinctEditions,
  sortValue,
}: {
  dispatch: React.Dispatch<Action>;
  distinctPublishedYears: readonly string[];
  distinctReadingYears: readonly string[];
  distinctKinds: readonly string[];
  distinctEditions: readonly string[];
  sortValue: Sort;
}): JSX.Element {
  return (
    <>
      <DebouncedInput
        label="Title"
        placeholder="Enter all or part of a title"
        onInputChange={(value) =>
          dispatch({ type: ActionType.FILTER_TITLE, value })
        }
      />
      <YearInput
        label="Published Year"
        years={distinctPublishedYears}
        onYearChange={(values) =>
          dispatch({ type: ActionType.FILTER_PUBLISHED_YEAR, values })
        }
      />
      <YearInput
        label="Reading Year"
        years={distinctReadingYears}
        onYearChange={(values) =>
          dispatch({ type: ActionType.FILTER_READING_YEAR, values })
        }
      />
      <SelectField
        label="Kind"
        onChange={(e) =>
          dispatch({
            type: ActionType.FILTER_KIND,
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
            type: ActionType.FILTER_EDITION,
            value: e.target.value,
          })
        }
      >
        <SelectOptions options={distinctEditions} />
      </SelectField>
      <SelectField
        value={sortValue}
        label="Order By"
        onChange={(e) =>
          dispatch({
            type: ActionType.SORT,
            value: e.target.value as Sort,
          })
        }
      >
        <option value="progress-date-desc">Reading Date (Newest First)</option>
        <option value="progress-date-asc">Reading Date (Oldest First)</option>
      </SelectField>
    </>
  );
}
