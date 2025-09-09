import { useState } from "react";

import { LabelText } from "./LabelText";
import { SelectInput } from "./SelectInput";

/**
 * Renders a year range selection field with "From" and "To" dropdowns.
 * Provides a way to select a range of years with automatic value sorting
 * to ensure the range is always valid. Handles state management internally.
 *
 * @param props - The component props
 * @param props.initialValues - Initial [min, max] year values for the range
 * @param props.label - The label text for the fieldset
 * @param props.onYearChange - Callback function called when the year range changes
 * @param props.years - Array of available year options
 * @returns A JSX element containing the year range selection fieldset
 */
export function YearField({
  initialValues,
  label,
  onYearChange,
  years,
}: {
  initialValues: string[] | undefined;
  label: string;
  onYearChange: (values: [string, string]) => void;
  years: readonly string[];
}): React.JSX.Element {
  const [minYear, setMinYear] = useState(
    initialValues && initialValues.length > 0 ? initialValues[0] : years[0],
  );
  const [maxYear, setMaxYear] = useState(
    initialValues && initialValues.length > 1
      ? initialValues[1]
      : (years.at(-1) as string),
  );

  const handleMinChange = (value: string): void => {
    const newMin = value;
    setMinYear(newMin);

    if (newMin <= maxYear) {
      onYearChange([newMin, maxYear]);
    } else {
      onYearChange([maxYear, newMin]);
    }
  };

  const handleMaxChange = (value: string): void => {
    const newMax = value;
    setMaxYear(newMax);

    if (minYear <= newMax) {
      onYearChange([minYear, newMax]);
    } else {
      onYearChange([newMax, minYear]);
    }
  };

  return (
    <fieldset className="text-subtle">
      <LabelText as="legend" value={label} />
      <div className="flex items-baseline">
        <label className="flex flex-1 items-center gap-x-[.5ch]">
          <span className="min-w-10 text-left text-sm tracking-serif-wide">
            From
          </span>
          <SelectInput
            onChange={(e) => handleMinChange(e.target.value)}
            value={minYear}
          >
            {years.map((year) => {
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </SelectInput>
        </label>
        <label className="flex flex-1 items-center">
          <span className="min-w-10 text-center text-sm tracking-serif-wide">
            to
          </span>
          <SelectInput
            onChange={(e) => handleMaxChange(e.target.value)}
            value={maxYear}
          >
            {[...years].reverse().map((year) => {
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </SelectInput>
        </label>
      </div>
    </fieldset>
  );
}
