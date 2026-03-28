import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { EditionFilterChangedAction } from "./editionReducer";

import { createEditionFilterChangedAction } from "./editionReducer";

export function EditionFacet({
  defaultValues,
  dispatch,
  distinctEditions,
  editionCounts,
}: {
  defaultValues: readonly string[] | undefined;
  dispatch: React.Dispatch<EditionFilterChangedAction>;
  distinctEditions: readonly string[];
  editionCounts: Map<string, number> | undefined;
}): React.JSX.Element {
  return (
    <AnimatedDetailsDisclosure title="Edition">
      <CheckboxListField
        defaultValues={defaultValues}
        label="Edition"
        onChange={(values) =>
          dispatch(createEditionFilterChangedAction(values))
        }
        onClear={() => dispatch(createEditionFilterChangedAction([]))}
        options={distinctEditions
          .filter((e) => e !== "All")
          .map((e) => ({
            count: editionCounts?.get(e) ?? 0,
            label: e,
            value: e,
          }))}
      />
    </AnimatedDetailsDisclosure>
  );
}
