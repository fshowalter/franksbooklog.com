import { TextFilter } from "~/components/TextFilter";

import type { ActionType } from "./Authors.reducer";

import { Actions } from "./Authors.reducer";

type FilterValues = {
  name?: string;
};

export function Filters({
  dispatch,
  filterValues,
}: {
  dispatch: React.Dispatch<ActionType>;
  filterValues: FilterValues;
}) {
  return (
    <>
      <TextFilter
        initialValue={filterValues.name || ""}
        label="Name"
        onInputChange={(value) =>
          dispatch({ type: Actions.PENDING_FILTER_NAME, value })
        }
        placeholder="Enter all or part of a name"
      />
    </>
  );
}
