import { useState } from "react";

import { LabelText } from "./LabelText";
import { SelectInput } from "./SelectInput";

/**
 * Year range selector with from/to dropdowns.
 * @param props - Component props
 * @param props.defaultValues - Default [min, max] year values
 * @param props.label - Field label text
 * @param props.onYearChange - Handler for year range changes
 * @param props.years - Available years to select from
 * @returns Year range selector with two dropdowns
 */
export function YearField({
  defaultValues,
  label,
  onYearChange,
  years,
}: {
  defaultValues: [string, string] | undefined;
  label: string;
  onYearChange: (values: [string, string]) => void;
  years: readonly string[];
}): React.JSX.Element {
  const [minYear, setMinYear] = useState(defaultMinValue(years, defaultValues));
  const [maxYear, setMaxYear] = useState(defaultMaxValue(years, defaultValues));

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
            defaultValue={defaultMinValue(years, defaultValues)}
            onChange={(e) => handleMinChange(e.target.value)}
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
            defaultValue={defaultMaxValue(years, defaultValues)}
            onChange={(e) => handleMaxChange(e.target.value)}
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

function defaultMaxValue(
  allValues: readonly string[],
  selectedValues?: [string, string],
): string {
  return selectedValues ? selectedValues[1] : (allValues.at(-1) as string);
}

function defaultMinValue(
  allValues: readonly string[],
  selectedValues?: [string, string],
): string {
  return selectedValues ? selectedValues[0] : allValues[0];
}
