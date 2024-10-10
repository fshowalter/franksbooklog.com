import type { ChangeEvent } from "react";

import { ccn } from "~/utils/concatClassNames";

import { LabelText } from "./LabelText";
import { SelectInput } from "./SelectInput";

export function SelectField({
  children,
  className,
  label,
  onChange,
  value,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
}): JSX.Element {
  return (
    <label className={ccn("flex flex-col", className)}>
      <LabelText value={label} />
      <SelectInput onChange={onChange} value={value?.toString()}>
        {children}
      </SelectInput>
    </label>
  );
}
