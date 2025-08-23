import { SelectField } from "~/components/SelectField";
import { SelectOptions } from "~/components/SelectOptions";
import { TextFilter } from "~/components/TextFilter";
import { YearInput } from "~/components/YearInput";

import type { ActionType } from "./Author.reducer";

import { Actions } from "./Author.reducer";

type FilterValues = {
  grade?: [number, number];
  kind?: string;
  reviewYear?: [string, string];
  title?: string;
  workYear?: [string, string];
};

export function Filters({
  dispatch,
  distinctKinds,
  distinctReviewYears,
  distinctWorkYears,
  filterValues,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctKinds: readonly string[];
  distinctReviewYears: readonly string[];
  distinctWorkYears: readonly string[];
  filterValues: FilterValues;
}) {
  return (
    <>
      <TextFilter
        initialValue={filterValues.title || ""}
        label="Title"
        onInputChange={(value) =>
          dispatch({ type: Actions.PENDING_FILTER_TITLE, value })
        }
        placeholder="Enter all or part of a title"
      />
      <YearInput
        label="Work Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.PENDING_FILTER_WORK_YEAR, values })
        }
        years={distinctWorkYears}
      />
      <YearInput
        label="Review Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.PENDING_FILTER_REVIEW_YEAR, values })
        }
        years={distinctReviewYears}
      />
      <SelectField
        label="Kind"
        onChange={(e) =>
          dispatch({
            type: Actions.PENDING_FILTER_KIND,
            value: e.target.value,
          })
        }
      >
        <SelectOptions options={distinctKinds} />
      </SelectField>
    </>
  );
}
