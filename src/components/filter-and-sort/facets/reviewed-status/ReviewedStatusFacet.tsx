import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { ReviewedStatusFilterChangedAction } from "./reviewedStatusReducer";

import { createReviewedStatusCountMap } from "./reviewedStatusFilter";
import { createReviewedStatusFilterChangedAction } from "./reviewedStatusReducer";

export function ReviewedStatusFacet<
  TValue extends Parameters<typeof createReviewedStatusCountMap>[0][number],
>({
  defaultValues,
  dispatch,
  excludeNotReviewed = false,
  values,
}: {
  defaultValues?: readonly string[];
  dispatch: React.Dispatch<ReviewedStatusFilterChangedAction>;
  excludeNotReviewed?: boolean;
  values: readonly TValue[];
}): React.JSX.Element {
  const statusCounts = createReviewedStatusCountMap(values);

  const allOptions = [
    {
      count: statusCounts.get("Reviewed") ?? 0,
      label: "Reviewed",
      value: "Reviewed",
    },
    {
      count: statusCounts.get("Not Reviewed") ?? 0,
      label: "Not Reviewed",
      value: "Not Reviewed",
    },
    {
      count: statusCounts.get("Abandoned") ?? 0,
      label: "Abandoned",
      value: "Abandoned",
    },
  ];
  const statusOptions = excludeNotReviewed
    ? allOptions.filter((o) => o.value !== "Not Reviewed")
    : allOptions;

  return (
    <AnimatedDetailsDisclosure title="Status">
      <CheckboxListField
        defaultValues={defaultValues}
        label="Status"
        onChange={(values) =>
          dispatch(createReviewedStatusFilterChangedAction(values))
        }
        options={statusOptions}
      />
    </AnimatedDetailsDisclosure>
  );
}
