import { FilterSection } from "~/components/filter-and-sort/FilterSection";
import { debounceOnChange } from "~/utils/debounce";

/**
 * Debounce delay for text filter input in milliseconds.
 */
export const TEXT_FILTER_DEBOUNCE_MS = 150;

type onChangeHandler = (value: string) => void;

/**
 * Text input field with label and debounced change handler.
 * @param props - Component props
 * @param props.defaultValue - Default input value
 * @param props.label - Field label text
 * @param props.onInputChange - Debounced handler for input changes
 * @param props.placeholder - Placeholder text
 * @returns Labeled text input field
 */
export function TextField({
  defaultValue,
  label,
  onInputChange,
  placeholder,
}: {
  defaultValue: string | undefined;
  label: string;
  onInputChange: onChangeHandler;
  placeholder: string;
}): React.JSX.Element {
  const debouncedHandleChange = debounceOnChange(
    onInputChange,
    TEXT_FILTER_DEBOUNCE_MS,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = (e.target as HTMLInputElement).value;
    debouncedHandleChange(newValue); // Debounce the callback
  };

  return (
    <FilterSection title={label}>
      <input
        aria-label={label}
        className={`
          w-full border-0 bg-default px-4 py-2 text-base text-default shadow-all
          outline-accent
          placeholder:text-default placeholder:opacity-50
        `}
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder={placeholder}
        type="text"
      />
    </FilterSection>
  );
}
