import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { YearField } from "~/components/filter-and-sort/fields/YearField";

import type { ReviewYearFilterChangedAction } from "./reviewYearReducer";

import { createReviewYearFilterChangedAction } from "./reviewYearReducer";

export function ReviewYearFacet({
  dispatch,
  distinctYears,
  values,
}: {
  dispatch: React.Dispatch<ReviewYearFilterChangedAction>;
  distinctYears: readonly string[];
  values: readonly [string, string] | undefined;
}): React.JSX.Element {
  return (
    <AnimatedDetailsDisclosure title="Review Year">
      <YearField
        label="Review Year"
        onYearChange={(values) =>
          dispatch(
            createReviewYearFilterChangedAction(
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
