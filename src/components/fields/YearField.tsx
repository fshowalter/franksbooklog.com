import { useEffect, useState } from "react";

import { FilterSection } from "~/components/filter-and-sort/FilterSection";

import { RangeSliderField } from "./RangeSliderField";
import { SelectInput } from "./SelectInput";

/**
 * Year range selector with from/to dropdowns and range slider.
 * AIDEV-NOTE: Spec requires BOTH dropdowns and slider - dual control pattern
 * @param props - Component props
 * @param props.defaultValues - Default [min, max] year values
 * @param props.label - Field label text
 * @param props.onClear - Handler for clear action (resets to full range)
 * @param props.onYearChange - Handler for year range changes
 * @param props.years - Available years to select from
 * @returns Year range selector with dropdowns and slider, wrapped in FilterSection
 */
export function YearField({
  defaultValues,
  label,
  onClear,
  onYearChange,
  years,
}: {
  defaultValues: [string, string] | undefined;
  label: string;
  onClear?: () => void;
  onYearChange: (values: [string, string]) => void;
  years: readonly string[];
}): React.JSX.Element {
  const [minYear, setMinYear] = useState(defaultMinValue(years, defaultValues));
  const [maxYear, setMaxYear] = useState(defaultMaxValue(years, defaultValues));

  // AIDEV-NOTE: Sync internal state when defaultValues changes (e.g., when cleared via applied filters)
  useEffect(() => {
    setMinYear(defaultMinValue(years, defaultValues));
    setMaxYear(defaultMaxValue(years, defaultValues));
  }, [defaultValues, years]);

  // AIDEV-NOTE: Convert year strings to numbers for slider
  const minYearNum = Number.parseInt(years[0], 10);
  const maxYearNum = Number.parseInt(years.at(-1)!, 10);
  const currentMinNum = Number.parseInt(minYear, 10);
  const currentMaxNum = Number.parseInt(maxYear, 10);

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

  // AIDEV-NOTE: Handle slider changes - snap to nearest valid year in array
  const handleSliderChange = (from: number, to: number): void => {
    // Find closest valid year in the years array
    const fromStr = findClosestYear(years, from);
    const toStr = findClosestYear(years, to);
    setMinYear(fromStr);
    setMaxYear(toStr);
    onYearChange([fromStr, toStr]);
  };

  // AIDEV-NOTE: Clear resets to full range AND calls onClear callback
  // The onClear callback dispatches removeAppliedFilter to immediately update
  // the Applied Filters section (removes the filter from both pending and active)
  const handleClear = (): void => {
    const fullMin = years[0];
    const fullMax = years.at(-1)!;
    setMinYear(fullMin);
    setMaxYear(fullMax);
    onYearChange([fullMin, fullMax]);
    if (onClear) {
      onClear();
    }
  };

  return (
    <FilterSection title={label}>
      <div className="flex flex-col gap-4">
        <fieldset aria-label={label} className="text-subtle">
          <div className="flex items-baseline">
            <label className="flex flex-1 items-center gap-x-[.5ch]">
              <span className="min-w-10 text-left text-sm tracking-serif-wide">
                From
              </span>
              <SelectInput
                defaultValue={minYear}
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
                defaultValue={maxYear}
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

        {/* AIDEV-NOTE: Range slider beneath dropdowns - syncs bidirectionally */}
        <RangeSliderField
          fromValue={currentMinNum}
          label={label}
          max={maxYearNum}
          min={minYearNum}
          onChange={handleSliderChange}
          onClear={handleClear}
          toValue={currentMaxNum}
        />
      </div>
    </FilterSection>
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

/**
 * Find the closest year in the years array to the target year.
 * This handles sparse year arrays (e.g., ["1930", "1943", "1978"]) where
 * the slider might select intermediate values that don't exist in the array.
 * @param years - Available years array
 * @param target - Target year number from slider
 * @returns Closest year string from the array
 */
function findClosestYear(years: readonly string[], target: number): string {
  let closest = years[0];
  let minDiff = Math.abs(Number.parseInt(years[0], 10) - target);

  for (const year of years) {
    const yearNum = Number.parseInt(year, 10);
    const diff = Math.abs(yearNum - target);
    if (diff < minDiff) {
      minDiff = diff;
      closest = year;
    }
  }

  return closest;
}
