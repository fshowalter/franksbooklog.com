import { AnimatedDetailsDisclosure } from "~/components/react/animated-details-disclosure/AnimatedDetailsDisclosure";
import { YearField } from "~/components/react/filter-and-sort/fields/YearField";

import type { TitleYearFilterChangedAction } from "./titleYearReducer";

import { createTitleYearFilterChangedAction } from "./titleYearReducer";

export function TitleYearFacet({
  defaultValues,
  dispatch,
  distinctYears,
}: {
  defaultValues: readonly [string, string] | undefined;
  dispatch: React.Dispatch<TitleYearFilterChangedAction>;
  distinctYears: readonly string[];
}): React.JSX.Element {
  return (
    <AnimatedDetailsDisclosure title="Year">
      <YearField
        defaultValues={defaultValues}
        label="Title Year"
        onYearChange={(values) =>
          dispatch(
            createTitleYearFilterChangedAction(
              values,
              distinctYears[0] ?? "",
              distinctYears.at(-1) ?? "",
            ),
          )
        }
        years={distinctYears}
      />
    </AnimatedDetailsDisclosure>
  );
}
