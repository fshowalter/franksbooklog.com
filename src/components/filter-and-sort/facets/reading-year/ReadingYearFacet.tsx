import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { YearField } from "~/components/filter-and-sort/fields/YearField";

import type { ReadingYearFilterChangedAction } from "./readingYearReducer";

import { createReadingYearFilterChangedAction } from "./readingYearReducer";

export function ReadingYearFacet({
  dispatch,
  distinctYears,
  values,
}: {
  dispatch: React.Dispatch<ReadingYearFilterChangedAction>;
  distinctYears: readonly string[];
  values: readonly [string, string] | undefined;
}): React.JSX.Element {
  return (
    <AnimatedDetailsDisclosure title="Reading Year">
      <YearField
        label="Reading Year"
        onYearChange={(values) =>
          dispatch(
            createReadingYearFilterChangedAction(
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
