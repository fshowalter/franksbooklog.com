import { Box } from "../Box";
import { Button } from "../Button";
import { DebouncedInput } from "../DebouncedInput";
import { SelectField, SelectOptions } from "../SelectField";
import { YearInput } from "../YearInput";
import { Action, ActionType, Sort } from "./Author.reducer";

export function Filters({
  dispatch,
  hideReviewed,
  distinctKinds,
  distinctPublishedYears,
  sortValue,
}: {
  dispatch: React.Dispatch<Action>;
  sortValue: Sort;
  hideReviewed: boolean;
  distinctKinds: readonly string[];
  distinctPublishedYears: readonly string[];
}) {
  return (
    <>
      <Box display="flex" flexDirection="column" justifyContent="flex-end">
        <Button onClick={() => dispatch({ type: ActionType.TOGGLE_REVIEWED })}>
          {hideReviewed ? "Show Reviewed" : "Hide Reviewed"}
        </Button>
      </Box>

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
        <option value="year-published-desc">
          Year Published (Newest First)
        </option>
        <option value="year-published-asc">
          Year Published (Oldest First)
        </option>
        <option value="title-asc">Title (A &rarr; Z)</option>
        <option value="title-desc">Title (Z &rarr; A)</option>
        <option value="grade-desc">Grade (Best First)</option>
        <option value="grade-asc">Grade (Worst First)</option>
      </SelectField>
    </>
  );
}
