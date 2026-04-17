import { RangeSliderField } from "./RangeSliderField";
import { SelectInput } from "./SelectInput";

export function YearField({
  label,
  onClear,
  onYearChange,
  values,
  years,
}: {
  label: string;
  onClear?: () => void;
  onYearChange: (values: [string, string]) => void;
  values: readonly [string, string] | undefined;
  years: readonly string[];
}): React.JSX.Element {
  // Convert year strings to numbers for slider
  const minYearNum = Number.parseInt(years[0], 10);
  const maxYearNum = Number.parseInt(years.at(-1)!, 10);
  const currentMinNum = Number.parseInt(minYear(years, values), 10);
  const currentMaxNum = Number.parseInt(maxYear(years, values), 10);

  const handleMinChange = (value: string): void => {
    const newMin = value;

    if (newMin <= maxYear(years, values)) {
      onYearChange([newMin, maxYear(years, values)]);
    } else {
      onYearChange([maxYear(years, values), newMin]);
    }
  };

  const handleMaxChange = (value: string): void => {
    const newMax = value;

    if (minYear(years, values) <= newMax) {
      onYearChange([minYear(years, values), newMax]);
    } else {
      onYearChange([newMax, minYear(years, values)]);
    }
  };

  // Handle slider changes - snap to nearest valid year in array
  const handleSliderChange = (from: number, to: number): void => {
    // Find closest valid year in the years array
    const fromStr = findClosestYear(years, from);
    const toStr = findClosestYear(years, to);
    onYearChange([fromStr, toStr]);
  };

  // Clear resets to full range AND calls onClear callback
  // The onClear callback dispatches removeAppliedFilter to immediately update
  // the Applied Filters section (removes the filter from both pending and active)
  const handleClear = (): void => {
    const fullMin = years[0];
    const fullMax = years.at(-1)!;
    if (onClear) {
      onClear();
    } else {
      onYearChange([fullMin, fullMax]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <fieldset aria-label={label} className="text-subtle">
        <div className="flex items-baseline">
          <label className="flex flex-1 items-center gap-x-[.5ch]">
            <span className="min-w-10 text-left text-sm tracking-serif-wide">
              From
            </span>
            <SelectInput
              defaultValue={minYear(years, values)}
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
              defaultValue={maxYear(years, values)}
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

      {/* Range slider beneath dropdowns - syncs bidirectionally */}
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
  );
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

function maxYear(
  allValues: readonly string[],
  selectedValues?: readonly [string, string],
): string {
  return selectedValues ? selectedValues[1] : (allValues.at(-1) as string);
}

function minYear(
  allValues: readonly string[],
  selectedValues?: readonly [string, string],
): string {
  return selectedValues ? selectedValues[0] : allValues[0];
}
