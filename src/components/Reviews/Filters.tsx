import { DebouncedInput } from "../DebouncedInput";
import { SelectField, SelectOptions } from "../SelectField";
import { YearInput } from "../YearInput";
import { Action, ActionType, Sort } from "./Reviews.reducer";

export function Filters({
  dispatch,
  sortValue,
  distinctPublishedYears,
  distinctReviewYears,
  distinctKinds,
}: {
  dispatch: React.Dispatch<Action>;
  sortValue: string;
  distinctReviewYears: readonly string[];
  distinctPublishedYears: readonly string[];
  distinctKinds: readonly string[];
}) {
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
        label="Year Published"
        years={distinctPublishedYears}
        onYearChange={(values) =>
          dispatch({ type: ActionType.FILTER_YEAR_PUBLISHED, values })
        }
      />
      <YearInput
        label="Year Reviewed"
        years={distinctReviewYears}
        onYearChange={(values) =>
          dispatch({ type: ActionType.FILTER_YEAR_REVIEWED, values })
        }
      />
      {/* <GradeInput
        label="Grade"
        onGradeChange={(values) =>
          dispatch({
            type: ActionType.FILTER_GRADE,
            values,
          })
        }
      /> */}
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
        value={sortValue}
        label="Order By"
        onChange={(e) =>
          dispatch({
            type: ActionType.SORT,
            value: e.target.value as Sort,
          })
        }
      >
        <option value="author-asc">Author (A &rarr; Z)</option>
        <option value="author-desc">Author (Z &rarr; A)</option>
        <option value="review-date-desc">Date Reviewed (Newest First)</option>
        <option value="review-date--asc">Date Reviewed (Oldest First)</option>
        <option value="year-published-desc">
          Year Published (Newest First)
        </option>
        <option value="year-published-asc">
          Year Published (Oldest First)
        </option>
        <option value="title">Title</option>
        <option value="grade-desc">Grade (Best First)</option>
        <option value="grade-asc">Grade (Worst First)</option>
      </SelectField>
    </>
  );
}
