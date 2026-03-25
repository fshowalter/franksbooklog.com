import { AnimatedDetailsDisclosure } from "~/components/react/animated-details-disclosure/AnimatedDetailsDisclosure";
import { YearField } from "~/components/react/filter-and-sort/fields/YearField";

import type { ReviewYearFilterChangedAction } from "./reviewYearReducer";

import { createReviewYearFilterChangedAction } from "./reviewYearReducer";

export function ReviewYearFacet({
  defaultValues,
  dispatch,
  distinctYears,
}: {
  defaultValues: readonly [string, string] | undefined;
  dispatch: React.Dispatch<ReviewYearFilterChangedAction>;
  distinctYears: readonly string[];
}): React.JSX.Element {
  return (
    <AnimatedDetailsDisclosure title="Review Year">
      <YearField
        defaultValues={defaultValues}
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
        years={distinctYears}
      />
    </AnimatedDetailsDisclosure>
  );
}
