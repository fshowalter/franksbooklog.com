import { AnimatedDetailsDisclosure } from "~/components/react/animated-details-disclosure/AnimatedDetailsDisclosure";
import { TextField } from "~/components/react/filter-and-sort/fields/TextField";

import type { TitleFilterChangedAction } from "./titleReducer";

import { createTitleFilterChangedAction } from "./titleReducer";

export function TitleFacet({
  defaultValue,
  dispatch,
}: {
  defaultValue: string | undefined;
  dispatch: React.Dispatch<TitleFilterChangedAction>;
}): React.JSX.Element {
  return (
    <AnimatedDetailsDisclosure title="Title">
      <TextField
        defaultValue={defaultValue}
        label="Title"
        onInputChange={(value) =>
          dispatch(createTitleFilterChangedAction(value))
        }
        placeholder="Enter all or part of a title"
      />
    </AnimatedDetailsDisclosure>
  );
}
