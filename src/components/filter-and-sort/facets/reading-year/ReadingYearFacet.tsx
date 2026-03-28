import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { YearField } from "~/components/filter-and-sort/fields/YearField";

import type { ReadingYearFilterChangedAction } from "./readingYearReducer";

import { createReadingYearFilterChangedAction } from "./readingYearReducer";

export function ReadingYearFacet({
  defaultValues,
  dispatch,
  distinctYears,
}: {
  defaultValues: readonly [string, string] | undefined;
  dispatch: React.Dispatch<ReadingYearFilterChangedAction>;
  distinctYears: readonly string[];
}): React.JSX.Element {
  return (
    <AnimatedDetailsDisclosure title="Reading Year">
      <YearField
        defaultValues={defaultValues}
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
        years={distinctYears}
      />
    </AnimatedDetailsDisclosure>
  );
}
