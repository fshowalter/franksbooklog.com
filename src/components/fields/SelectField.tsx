import { LabelText } from "./LabelText";
import { SelectInput } from "./SelectInput";

/**
 * Select field component with label.
 * @param props - Component props
 * @param props.children - Option elements to render inside select
 * @param props.defaultValue - Initially selected value
 * @param props.label - Field label text
 * @param props.onChange - Handler for value changes
 * @returns Labeled select field
 */
export function SelectField({
  children,
  defaultValue,
  label,
  onChange,
}: {
  children: React.ReactNode;
  defaultValue: string | undefined;
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
      <SelectInput defaultValue={defaultValue} onChange={handleChange}>
        {children}
      </SelectInput>
    </label>
  );
}
