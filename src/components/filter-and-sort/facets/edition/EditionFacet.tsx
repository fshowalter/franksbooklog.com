import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { EditionFilterChangedAction } from "./editionReducer";

import { createEditionCountMap } from "./editionFilter";
import { createEditionFilterChangedAction } from "./editionReducer";

export function EditionFacet<
  TValue extends Parameters<typeof createEditionCountMap>[0][number],
>({
  defaultValues,
  dispatch,
  distinctEditions,
  values,
}: {
  defaultValues: readonly string[] | undefined;
  dispatch: React.Dispatch<EditionFilterChangedAction>;
  distinctEditions: readonly string[];
  values: readonly TValue[];
}): React.JSX.Element {
  const editionCounts = createEditionCountMap(values);

  return (
    <AnimatedDetailsDisclosure title="Edition">
      <CheckboxListField
        defaultValues={defaultValues}
        label="Edition"
        onChange={(values) =>
          dispatch(createEditionFilterChangedAction(values))
        }
        options={distinctEditions.map((e) => ({
          count: editionCounts.get(e) ?? 0,
          label: e,
          value: e,
        }))}
      />
    </AnimatedDetailsDisclosure>
  );
}
