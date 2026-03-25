import { AnimatedDetailsDisclosure } from "~/components/react/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/react/filter-and-sort/fields/CheckboxListField";

import type { ReviewedStatusFilterChangedAction } from "./reviewedStatusReducer";

import { createReviewedStatusFilterChangedAction } from "./reviewedStatusReducer";

export function ReviewedStatusFacet({
  defaultValues,
  dispatch,
  excludeNotReviewed = false,
  statusCounts,
}: {
  defaultValues?: readonly string[];
  dispatch: React.Dispatch<ReviewedStatusFilterChangedAction>;
  excludeNotReviewed?: boolean;
  statusCounts?: Map<string, number>;
}): React.JSX.Element {
  const allOptions = [
    {
      count: statusCounts?.get("Reviewed") ?? 0,
      label: "Reviewed",
      value: "Reviewed",
    },
    {
      count: statusCounts?.get("Not Reviewed") ?? 0,
      label: "Not Reviewed",
      value: "Not Reviewed",
    },
    {
      count: statusCounts?.get("Abandoned") ?? 0,
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
        onClear={() => dispatch(createReviewedStatusFilterChangedAction([]))}
        options={statusOptions}
      />
    </AnimatedDetailsDisclosure>
  );
}
