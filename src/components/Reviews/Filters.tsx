import { DebouncedInput } from "~/components/DebouncedInput";
import { SelectField } from "~/components/SelectField";
import { SelectOptions } from "~/components/SelectOptions";
import { YearInput } from "~/components/YearInput";

import type { ActionType, Sort } from "./Reviews.reducer";

import { Actions } from "./Reviews.reducer";

export function Filters({
  dispatch,
  distinctKinds,
  distinctPublishedYears,
  distinctReviewYears,
  sortValue,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctKinds: readonly string[];
  distinctPublishedYears: readonly string[];
  distinctReviewYears: readonly string[];
  sortValue: Sort;
}) {
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
        <option value="author-asc">Author (A &rarr; Z)</option>
        <option value="author-desc">Author (Z &rarr; A)</option>
        <option value="review-date-desc">Review Date (Newest First)</option>
        <option value="review-date-asc">Review Date (Oldest First)</option>
        <option value="year-published-desc">Work Year (Newest First)</option>
        <option value="year-published-asc">Work Year (Oldest First)</option>
        <option value="title-asc">Title (A &rarr; Z)</option>
        <option value="title-desc">Title (Z &rarr; A)</option>
        <option value="grade-desc">Grade (Best First)</option>
        <option value="grade-asc">Grade (Worst First)</option>
      </SelectField>
    </>
  );
}
