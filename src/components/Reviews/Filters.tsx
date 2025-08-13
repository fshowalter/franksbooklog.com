import { SelectField } from "~/components/SelectField";
import { SelectOptions } from "~/components/SelectOptions";
import { TextFilter } from "~/components/TextFilter";
import { YearInput } from "~/components/YearInput";

import type { ActionType } from "./Reviews.reducer";

import { Actions } from "./Reviews.reducer";

export function Filters({
  dispatch,
  distinctKinds,
  distinctPublishedYears,
  distinctReviewYears,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctKinds: readonly string[];
  distinctPublishedYears: readonly string[];
  distinctReviewYears: readonly string[];
}) {
  return (
    <>
      <TextFilter
        label="Title"
        onInputChange={(value) =>
          dispatch({ type: Actions.FILTER_TITLE, value })
        }
        placeholder="Enter all or part of a title"
      />
      <YearInput
        label="Work Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.FILTER_YEAR_PUBLISHED, values })
        }
        years={distinctPublishedYears}
      />
      <YearInput
        label="Review Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.FILTER_YEAR_REVIEWED, values })
        }
        years={distinctReviewYears}
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
    </>
  );
}
