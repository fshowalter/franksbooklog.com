import { CheckboxListField } from "~/components/fields/CheckboxListField";

import { FilterSection } from "./FilterSection";

const allOptions = [
  { count: 0, label: "Reviewed", value: "Reviewed" },
  { count: 0, label: "Not Reviewed", value: "Not Reviewed" },
  { count: 0, label: "Abandoned", value: "Abandoned" },
];

/**
 * Filter control for reviewed/not-reviewed/abandoned status.
 * @param props - Component props
 * @param props.defaultValues - Currently selected status values
 * @param props.excludeNotReviewed - When true, omits "Not Reviewed" option (for reviews/author-titles)
 * @param props.onChange - Handler for filter changes
 * @param props.onClear - Handler for clearing the filter
 * @returns Reviewed status filter with checkboxes
 */
export function ReviewedStatusFilter({
  defaultValues,
  excludeNotReviewed = false,
  onChange,
  onClear,
}: {
  defaultValues?: readonly string[];
  excludeNotReviewed?: boolean;
  onChange: (values: string[]) => void;
  onClear?: () => void;
}): React.JSX.Element {
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
