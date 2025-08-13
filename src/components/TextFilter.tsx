import type { JSX } from "react";

import { useMemo } from "react";

import type { OnChangeHandler } from "~/utils/debounce";

import { debounce } from "~/utils/debounce";

import { LabelText } from "./LabelText";

export function TextFilter({
  label,
  onInputChange,
  placeholder,
}: {
  label: string;
  onInputChange: OnChangeHandler;
  placeholder: string;
}): JSX.Element {
  const debouncedHandleChange = useMemo(
    () => debounce(onInputChange, 150),
    [onInputChange],
  );

  return (
    <label className="flex flex-col text-subtle">
      <LabelText value={label} />
      <input
        className={`
          border-0 bg-default px-4 py-2 text-base text-default shadow-all
          placeholder:text-default placeholder:opacity-50
        `}
        onChange={(e: React.FormEvent<HTMLInputElement>) =>
          debouncedHandleChange((e.target as HTMLInputElement).value)
        }
        placeholder={placeholder}
        type="text"
      />
    </label>
  );
}
