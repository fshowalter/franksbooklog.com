import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { KindFilterChangedAction } from "./kindReducer";

import { createKindCountMap } from "./kindFilter";
import { createKindFilterChangedAction } from "./kindReducer";

export function KindFacet<
  TValue extends Parameters<typeof createKindCountMap>[0][number],
  TFilters extends Parameters<typeof createKindCountMap>[1],
>({
  dispatch,
  distinctKinds,
  filterer,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<KindFilterChangedAction>;
  distinctKinds: readonly string[];
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[];
  filterValues: TFilters;
  values: readonly TValue[];
}): React.JSX.Element {
  const kindCounts = createKindCountMap(values, filterValues, filterer);

  return (
    <AnimatedDetailsDisclosure title="Kind">
      <CheckboxListField
        defaultValues={filterValues.kind}
        label="Kind"
        onChange={(values) => dispatch(createKindFilterChangedAction(values))}
        options={distinctKinds.map((e) => ({
          count: kindCounts.get(e) ?? 0,
          label: e,
          value: e,
        }))}
      />
    </AnimatedDetailsDisclosure>
  );
}
