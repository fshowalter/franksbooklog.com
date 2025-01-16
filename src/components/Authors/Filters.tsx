import { DebouncedInput } from "~/components/DebouncedInput";
import { SelectField } from "~/components/SelectField";

import type { ActionType, Sort } from "./Authors.reducer";

import { Actions } from "./Authors.reducer";

export function Filters({
  dispatch,
  sortValue,
}: {
  dispatch: React.Dispatch<ActionType>;
  sortValue: Sort;
}) {
  return (
    <>
      <DebouncedInput
        label="Name"
        onInputChange={(value) =>
          dispatch({ type: Actions.FILTER_NAME, value })
        }
        placeholder="Enter all or part of a name"
      />
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
        <option value="name-asc">Name (A &rarr; Z)</option>
        <option value="name-desc">Name (Z &rarr; A)</option>
        <option value="review-count-desc">Review Count (Most First)</option>
        <option value="review-count-asc">Review Count (Fewest First)</option>
      </SelectField>
    </>
  );
}
