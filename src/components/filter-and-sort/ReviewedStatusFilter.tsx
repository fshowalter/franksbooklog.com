import { CheckboxListField } from "~/components/fields/CheckboxListField";

import { FilterSection } from "./FilterSection";

/**
 * Filter control for reviewed/not-reviewed/abandoned status.
 * @param props - Component props
 * @param props.counts - Map of status to item count for display next to each option
 * @param props.defaultValues - Currently selected status values
 * @param props.excludeNotReviewed - When true, omits "Not Reviewed" option (for reviews/author-titles)
 * @param props.onChange - Handler for filter changes
 * @param props.onClear - Handler for clearing the filter
 * @returns Reviewed status filter with checkboxes
 */
export function ReviewedStatusFilter({
  counts,
  defaultValues,
  excludeNotReviewed = false,
  onChange,
  onClear,
}: {
  counts?: Map<string, number>;
  defaultValues?: readonly string[];
  excludeNotReviewed?: boolean;
  onChange: (values: string[]) => void;
  onClear?: () => void;
}): React.JSX.Element {
  const allOptions = [
    { count: counts?.get("Reviewed") ?? 0, label: "Reviewed", value: "Reviewed" },
    { count: counts?.get("Not Reviewed") ?? 0, label: "Not Reviewed", value: "Not Reviewed" },
    { count: counts?.get("Abandoned") ?? 0, label: "Abandoned", value: "Abandoned" },
  ];
  const statusOptions = excludeNotReviewed
    ? allOptions.filter((o) => o.value !== "Not Reviewed")
    : allOptions;

  return (
    <FilterSection title="Status">
      <CheckboxListField
        defaultValues={defaultValues}
        label="Status"
        onChange={onChange}
        onClear={onClear}
        options={statusOptions}
      />
    </FilterSection>
  );
}
