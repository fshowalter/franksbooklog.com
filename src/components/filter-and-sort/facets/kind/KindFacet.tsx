import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { KindFilterChangedAction } from "./kindReducer";

import { createKindCountMap } from "./kindFilter";
import { createKindFilterChangedAction } from "./kindReducer";

export function KindFacet<
  TValue extends Parameters<typeof createKindCountMap>[0][number],
>({
  defaultValues,
  dispatch,
  distinctKinds,
  values,
}: {
  defaultValues: readonly string[] | undefined;
  dispatch: React.Dispatch<KindFilterChangedAction>;
  distinctKinds: readonly string[];
  values: readonly TValue[];
}): React.JSX.Element {
  const kindCounts = createKindCountMap(values);

  return (
    <AnimatedDetailsDisclosure title="Kind">
      <CheckboxListField
        defaultValues={defaultValues}
        label="Kind"
        onChange={(values) => dispatch(createKindFilterChangedAction(values))}
        options={distinctKinds.map((e) => ({
          count: kindCounts?.get(e) ?? 0,
          label: e,
          value: e,
        }))}
      />
    </AnimatedDetailsDisclosure>
  );
}
