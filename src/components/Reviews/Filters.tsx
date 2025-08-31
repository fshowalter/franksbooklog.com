import { GradeInput } from "~/components/GradeField";
import { SelectField } from "~/components/SelectField";
import { SelectOptions } from "~/components/SelectOptions";
import { TextField } from "~/components/TextField";
import { YearField } from "~/components/YearField";

import type { ActionType } from "./Reviews.reducer";

import { Actions } from "./Reviews.reducer";

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
      <TextField
        initialValue={filterValues.title || ""}
        label="Title"
        onInputChange={(value) =>
          dispatch({ type: Actions.PENDING_FILTER_TITLE, value })
        }
        placeholder="Enter all or part of a title"
      />
      <YearField
        label="Work Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.PENDING_FILTER_WORK_YEAR, values })
        }
        years={distinctWorkYears}
      />
      <YearField
        label="Review Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.PENDING_FILTER_REVIEW_YEAR, values })
        }
        years={distinctReviewYears}
      />
      <GradeInput
        label="Grade"
        onGradeChange={(values) =>
          dispatch({
            type: Actions.PENDING_FILTER_GRADE,
            values,
          })
        }
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
