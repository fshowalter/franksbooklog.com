import { type JSX, useState } from "react";

import { LabelText } from "./LabelText";
import { SelectInput } from "./SelectInput";

export function YearInput({
  label,
  onYearChange,
  years,
}: {
  label: string;
  onYearChange: (values: [string, string]) => void;
  years: readonly string[];
}): JSX.Element {
  const [minYear, setMinYear] = useState(years[0]);
  const [maxYear, setMaxYear] = useState(years.at(-1) as string);

  const handleMinChange = (value: string) => {
    const newMin = value;
    setMinYear(newMin);

    if (newMin <= maxYear) {
      onYearChange([newMin, maxYear]);
    } else {
      onYearChange([maxYear, newMin]);
    }
  };

  const handleMaxChange = (value: string) => {
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
