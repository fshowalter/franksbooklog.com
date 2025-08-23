import type { JSX } from "react";

import { SelectField } from "~/components/SelectField";
import { SelectOptions } from "~/components/SelectOptions";
import { TextFilter } from "~/components/TextFilter";
import { YearInput } from "~/components/YearInput";

import type { ActionType } from "./Readings.reducer";

import { Actions } from "./Readings.reducer";

type FilterValues = {
  edition?: string;
  kind?: string;
  readingYears?: string[];
  title?: string;
  workYears?: string[];
};

export function Filters({
  dispatch,
  distinctEditions,
  distinctKinds,
  distinctReadingYears,
  distinctWorkYears,
  filterKey,
  filterValues,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctEditions: readonly string[];
  distinctKinds: readonly string[];
  distinctReadingYears: readonly string[];
  distinctWorkYears: readonly string[];
  filterKey?: string;
  filterValues: FilterValues;
}): JSX.Element {
  return (
    <>
      <TextFilter
        initialValue={filterValues.title || ""}
        key={`title-${filterKey}`}
        label="Title"
        onInputChange={(value) =>
          dispatch({ type: Actions.PENDING_FILTER_TITLE, value })
        }
        placeholder="Enter all or part of a title"
      />
      <YearInput
        initialValues={filterValues.workYears || []}
        key={`work-year-${filterKey}`}
        label="Work Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.PENDING_FILTER_WORK_YEAR, values })
        }
        years={distinctWorkYears}
      />
      <YearInput
        initialValues={filterValues.readingYears || []}
        key={`reading-year-${filterKey}`}
        label="Reading Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.PENDING_FILTER_READING_YEAR, values })
        }
        years={distinctReadingYears}
      />
      <SelectField
        label="Kind"
        onChange={(e) =>
          dispatch({
            type: Actions.PENDING_FILTER_KIND,
            value: e.target.value,
          })
        }
        value={filterValues.kind || "All"}
      >
        <SelectOptions options={distinctKinds} />
      </SelectField>
      <SelectField
        label="Edition"
        onChange={(e) =>
          dispatch({
            type: Actions.PENDING_FILTER_EDITION,
            value: e.target.value,
          })
        }
        value={filterValues.edition || "All"}
      >
        <SelectOptions options={distinctEditions} />
      </SelectField>
    </>
  );
}
