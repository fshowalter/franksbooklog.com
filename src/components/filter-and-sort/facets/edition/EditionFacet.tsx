import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { EditionFilterChangedAction } from "./editionReducer";

import { createEditionCountMap } from "./editionFilter";
import { createEditionFilterChangedAction } from "./editionReducer";

export function EditionFacet<
  TValue extends Parameters<typeof createEditionCountMap>[0][number],
  TFilters extends Parameters<typeof createEditionCountMap>[1],
>({
  dispatch,
  distinctEditions,
  filterer,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<EditionFilterChangedAction>;
  distinctEditions: readonly string[];
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[];
  filterValues: TFilters;
  values: readonly TValue[];
}): React.JSX.Element {
  const editionCounts = createEditionCountMap(values, filterValues, filterer);

  return (
    <AnimatedDetailsDisclosure title="Edition">
      <CheckboxListField
        label="Edition"
        onChange={(values) =>
          dispatch(createEditionFilterChangedAction(values))
        }
        options={distinctEditions.map((e) => ({
          count: editionCounts.get(e) ?? 0,
          label: e,
          value: e,
        }))}
        selectedValues={filterValues.edition}
      />
    </AnimatedDetailsDisclosure>
  );
}
