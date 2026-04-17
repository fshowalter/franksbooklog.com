import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { YearField } from "~/components/filter-and-sort/fields/YearField";

import type { TitleYearFilterChangedAction } from "./titleYearReducer";

import { createTitleYearFilterChangedAction } from "./titleYearReducer";

export function TitleYearFacet({
  dispatch,
  distinctYears,
  values,
}: {
  dispatch: React.Dispatch<TitleYearFilterChangedAction>;
  distinctYears: readonly string[];
  values: readonly [string, string] | undefined;
}): React.JSX.Element {
  return (
    <AnimatedDetailsDisclosure title="Year">
      <YearField
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
        values={values}
        years={distinctYears}
      />
    </AnimatedDetailsDisclosure>
  );
}
