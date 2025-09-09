import { LabelText } from "./LabelText";
import { SelectInput } from "./SelectInput";

/**
 * Select field component with label for form inputs.
 * Provides a consistent interface for dropdown selections with proper labeling.
 * 
 * @param props - Component props
 * @param props.children - Option elements to render inside the select
 * @param props.initialValue - Initial selected value
 * @param props.label - Label text to display above the select
 * @param props.onChange - Callback fired when selection changes
 * @returns Select field component with label
 */
export function SelectField({
  children,
  initialValue,
  label,
  onChange,
}: {
  children: React.ReactNode;
  initialValue: string | undefined;
  label: string;
  onChange: (value: string) => void;
}): React.JSX.Element {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return (
    <label className={`flex flex-col`}>
      <LabelText value={label} />
      <SelectInput onChange={handleChange} value={initialValue}>
        {children}
      </SelectInput>
    </label>
  );
}
