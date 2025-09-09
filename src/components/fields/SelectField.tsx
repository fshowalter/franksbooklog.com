import { LabelText } from "./LabelText";
import { SelectInput } from "./SelectInput";

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
