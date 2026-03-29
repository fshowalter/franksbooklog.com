import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { ReviewedStatusFilterChangedAction } from "./reviewedStatusReducer";

import { createReviewedStatusCountMap } from "./reviewedStatusFilter";
import { createReviewedStatusFilterChangedAction } from "./reviewedStatusReducer";

export function ReviewedStatusFacet<
  TValue extends Parameters<typeof createReviewedStatusCountMap>[0][number],
  TFilters extends Parameters<typeof createReviewedStatusCountMap>[1],
>({
  dispatch,
  excludeNotReviewed = false,
  filterer,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<ReviewedStatusFilterChangedAction>;
  excludeNotReviewed?: boolean;
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[];
  filterValues: TFilters;
  values: readonly TValue[];
}): React.JSX.Element {
  const statusCounts = createReviewedStatusCountMap(
    values,
    filterValues,
    filterer,
  );

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
        defaultValues={filterValues.reviewedStatus}
        label="Status"
        onChange={(values) =>
          dispatch(createReviewedStatusFilterChangedAction(values))
        }
        options={statusOptions}
      />
    </AnimatedDetailsDisclosure>
  );
}
