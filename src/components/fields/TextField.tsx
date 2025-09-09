import { useState } from "react";

import { debounceOnChange } from "~/utils/debounce";

import { LabelText } from "./LabelText";

/**
 * Debounce delay in milliseconds for text field input changes
 */
export const TEXT_FILTER_DEBOUNCE_MS = 150;

type onChangeHandler = (value: string) => void;

/**
 * Text input field component with debounced change handling.
 * Provides immediate visual feedback while debouncing the actual callback
 * to prevent excessive event firing during typing.
 *
 * @param props - Component props
 * @param props.initialValue - Initial text value
 * @param props.label - Label text to display above the input
 * @param props.onInputChange - Debounced callback fired when text changes
 * @param props.placeholder - Placeholder text for the input
 * @returns Text field component with label
 */
export function TextField({
  initialValue,
  label,
  onInputChange,
  placeholder,
}: {
  initialValue: string | undefined;
  label: string;
  onInputChange: onChangeHandler;
  placeholder: string;
}): React.JSX.Element {
  // Initialize with the initial value, then manage state internally
  const [localValue, setLocalValue] = useState(initialValue || "");
  const debouncedHandleChange = debounceOnChange(
    onInputChange,
    TEXT_FILTER_DEBOUNCE_MS,
  );

  const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
    const newValue = (e.target as HTMLInputElement).value;
    setLocalValue(newValue); // Update immediately for responsive typing
    debouncedHandleChange(newValue); // Debounce the callback
  };

  return (
    <label className="flex flex-col text-subtle">
      <LabelText value={label} />
      <input
        className={`
          border-0 bg-default px-4 py-2 text-base text-default shadow-all
          outline-accent
          placeholder:text-default placeholder:opacity-50
        `}
        onChange={handleChange}
        placeholder={placeholder}
        type="text"
        value={localValue}
      />
    </label>
  );
}
