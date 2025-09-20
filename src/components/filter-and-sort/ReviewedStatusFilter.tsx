import { SelectField } from "~/components/fields/SelectField";

/**
 * Filter control for reviewed/unreviewed status.
 * @param props - Component props
 * @param props.defaultValue - Initial selected value
 * @param props.onChange - Handler for filter changes
 * @returns Reviewed status filter select field
 */
export function ReviewedStatusFilter({
  defaultValue,
  onChange,
}: {
  defaultValue: string | undefined;
  onChange: (value: string) => void;
}): React.JSX.Element {
  return (
    <SelectField
      defaultValue={defaultValue}
      label="Reviewed Status"
      onChange={onChange}
    >
      <option key={0} value={"All"}>
        All
      </option>
      <option key={1} value={"Reviewed"}>
        Reviewed
      </option>
      <option key={2} value={"Not Reviewed"}>
        Not Reviewed
      </option>
    </SelectField>
  );
}
