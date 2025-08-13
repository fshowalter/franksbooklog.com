import { TextFilter } from "~/components/TextFilter";

import type { ActionType } from "./Authors.reducer";

import { Actions } from "./Authors.reducer";

export function Filters({
  dispatch,
}: {
  dispatch: React.Dispatch<ActionType>;
}) {
  return (
    <>
      <TextFilter
        label="Name"
        onInputChange={(value) =>
          dispatch({ type: Actions.FILTER_NAME, value })
        }
        placeholder="Enter all or part of a name"
      />
    </>
  );
}
