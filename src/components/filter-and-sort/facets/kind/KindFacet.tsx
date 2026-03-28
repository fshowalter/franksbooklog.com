import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { KindFilterChangedAction } from "./kindReducer";

import { createKindFilterChangedAction } from "./kindReducer";

export function KindFacet({
  defaultValues,
  dispatch,
  distinctKinds,
  kindCounts,
}: {
  defaultValues: readonly string[] | undefined;
  dispatch: React.Dispatch<KindFilterChangedAction>;
  distinctKinds: readonly string[];
  kindCounts: Map<string, number> | undefined;
}): React.JSX.Element {
  return (
    <AnimatedDetailsDisclosure title="Kind">
      <CheckboxListField
        defaultValues={defaultValues}
        label="Kind"
        onChange={(values) => dispatch(createKindFilterChangedAction(values))}
        onClear={() => dispatch(createKindFilterChangedAction([]))}
        options={distinctKinds
          .filter((e) => e !== "All")
          .map((e) => ({
            count: kindCounts?.get(e) ?? 0,
            label: e,
            value: e,
          }))}
      />
    </AnimatedDetailsDisclosure>
  );
}
