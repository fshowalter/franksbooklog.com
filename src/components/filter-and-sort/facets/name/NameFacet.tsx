import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { TextField } from "~/components/filter-and-sort/fields/TextField";

import type { NameFilterChangedAction } from "./nameReducer";

import { createNameFilterChangedAction } from "./nameReducer";

export function NameFacet({
  defaultValue,
  dispatch,
}: {
  defaultValue: string | undefined;
  dispatch: React.Dispatch<NameFilterChangedAction>;
}): React.JSX.Element {
  return (
    <AnimatedDetailsDisclosure title="Name">
      <TextField
        defaultValue={defaultValue}
        label="Name"
        onInputChange={(value) =>
          dispatch(createNameFilterChangedAction(value))
        }
        placeholder="Enter all or part of a name"
      />
    </AnimatedDetailsDisclosure>
  );
}
