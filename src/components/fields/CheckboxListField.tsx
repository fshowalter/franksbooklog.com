import { useEffect, useRef, useState } from "react";

import { FilterSection } from "~/components/filter-and-sort/FilterSection";

import { LabelText } from "./LabelText";

type CheckboxListFieldOption = {
  count: number;
  label: string;
  value: string;
};

type CheckboxListFieldProps = {
  defaultValues?: readonly string[];
  label: string;
  onChange: (values: string[]) => void;
  onClear?: () => void;
  options: readonly CheckboxListFieldOption[];
  showMoreThreshold?: number;
};

/**
 * Checkbox list field for multi-selection with show more/less and clear functionality.
 * Selected items automatically move to top of list.
 * @param props - Component props
 * @param props.defaultValues - Default selected values
 * @param props.label - Field label text (visually hidden but accessible)
 * @param props.onChange - Handler for selection changes
 * @param props.onClear - Handler for clear action
 * @param props.options - Available options with labels, values, and counts
 * @param props.showMoreThreshold - Number of items to show before "Show more" (default: 3)
 * @returns Checkbox list field with show more and clear functionality
 */
export function CheckboxListField({
  defaultValues,
  label,
  onChange,
  onClear,
  options,
  showMoreThreshold = 3,
}: CheckboxListFieldProps): React.JSX.Element {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    defaultValues ? [...defaultValues] : [],
  );
  const [showAll, setShowAll] = useState(false);
  const fieldsetRef = useRef<HTMLFieldSetElement | null>(null);

  // Determine if we need show more functionality
  const shouldShowMore = options.length > showMoreThreshold;

  // AIDEV-NOTE: Sort options - selected items first only if show more is needed AND hasn't been clicked
  // Once "show more" is clicked, maintain alphabetical order to prevent re-sorting on selection changes
  const sortedOptions = [...options].toSorted((a, b) => {
    const shouldSortSelectedFirst = shouldShowMore && !showAll;

    if (shouldSortSelectedFirst) {
      const aSelected = selectedValues.includes(a.value);
      const bSelected = selectedValues.includes(b.value);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      if (aSelected && bSelected) {
        // Both selected - maintain selection order (most recent first)
        return (
          selectedValues.indexOf(b.value) - selectedValues.indexOf(a.value)
        );
      }
    }

    // Both unselected (or showAll is true) - alphabetical order
    return a.label.localeCompare(b.label);
  });

  // Determine which options to display
  // AIDEV-NOTE: Always show all selected items + up to showMoreThreshold unselected items
  const selectedCount = selectedValues.length;
  const visibleCount = showAll
    ? sortedOptions.length
    : selectedCount + showMoreThreshold;
  const visibleOptions = sortedOptions.slice(
    0,
    Math.min(visibleCount, sortedOptions.length),
  );
  const hiddenCount = sortedOptions.length - visibleOptions.length;

  const handleCheckboxChange = (value: string, checked: boolean): void => {
    const newValues = checked
      ? [...selectedValues, value]
      : selectedValues.filter((v) => v !== value);

    setSelectedValues(newValues);
    onChange(newValues);
  };

  const handleClear = (): void => {
    setSelectedValues([]);
    onChange([]);
    if (onClear) {
      onClear();
    }
  };

  const handleShowMore = (): void => {
    setShowAll(true);
  };

  // AIDEV-NOTE: Sync selectedValues when defaultValues changes from parent
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentionally syncing controlled state from props
    setSelectedValues(defaultValues ? [...defaultValues] : []);
  }, [defaultValues]);

  // AIDEV-NOTE: Listen for form reset events and clear selections when form is reset.
  // Uses closest("form") on the fieldset ref to find the containing form rather than
  // document.querySelector("form"), which would grab the first form in the DOM (e.g. search).
  useEffect(() => {
    const form = fieldsetRef.current?.closest("form");
    if (!form) return;

    const handleFormReset = (): void => {
      setSelectedValues(defaultValues ? [...defaultValues] : []);
      setShowAll(false);
    };

    form.addEventListener("reset", handleFormReset);

    return (): void => {
      form.removeEventListener("reset", handleFormReset);
    };
  }, [defaultValues]);

  const fieldsetId = `checkbox-list-${label.toLowerCase().replaceAll(/\s+/g, "-")}`;
  const hasSelections = selectedValues.length > 0;

  return (
    <FilterSection title={label}>
      <fieldset
        aria-describedby={hasSelections ? `${fieldsetId}-count` : undefined}
        className="text-left font-sans"
        ref={fieldsetRef}
      >
        {/* Visually hidden legend for screen readers */}
        <legend className="sr-only">
          <LabelText as="span" value={label} />
        </legend>

        <div className="flex flex-col gap-2">
          {/* Checkbox list */}
          <div className="flex flex-col">
            {visibleOptions.map((option) => {
              const isChecked = selectedValues.includes(option.value);
              const checkboxId = `${fieldsetId}-${option.value}`;

              return (
                <label
                  className={`
                    flex cursor-pointer items-center gap-3 rounded-sm pb-2
                    last-of-type:pb-0
                    focus-within:bg-stripe
                    hover:bg-stripe
                  `}
                  htmlFor={checkboxId}
                  key={option.value}
                >
                  <input
                    checked={isChecked}
                    className="size-4 cursor-pointer accent-accent"
                    id={checkboxId}
                    onChange={(e) =>
                      handleCheckboxChange(option.value, e.target.checked)
                    }
                    type="checkbox"
                    value={option.value}
                  />
                  <span className="flex-1 text-base text-default">
                    {option.label}
                  </span>
                  <span className="text-base text-subtle">
                    ({option.count})
                  </span>
                </label>
              );
            })}
          </div>

          {/* Show more and Clear links */}
          <div className="flex items-center gap-2">
            {shouldShowMore && !showAll && hiddenCount > 0 && (
              <>
                <button
                  aria-expanded={showAll}
                  className={`mt-2 font-sans text-sm text-accent underline`}
                  onClick={handleShowMore}
                  type="button"
                >
                  {/* AIDEV-NOTE: Spec compliance - "Show more" text must have no count */}
                  Show more
                </button>
                {hasSelections && (
                  <span aria-hidden="true" className="mt-2 text-sm text-subtle">
                    |
                  </span>
                )}
              </>
            )}
            {hasSelections && (
              <button
                aria-label={`Clear all ${label} selections`}
                className={`mt-2 font-sans text-sm text-accent underline`}
                onClick={handleClear}
                type="button"
              >
                Clear
              </button>
            )}
          </div>

          {/* Selection count for screen readers — always in DOM so aria-live is registered before first selection */}
          <div
            aria-live="polite"
            className="sr-only"
            id={`${fieldsetId}-count`}
          >
            {hasSelections &&
              `${selectedValues.length} ${selectedValues.length === 1 ? "option" : "options"} selected`}
          </div>
        </div>
      </fieldset>
    </FilterSection>
  );
}
