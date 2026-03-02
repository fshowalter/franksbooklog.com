import { useEffect, useState } from "react";

import { FilterSection } from "~/components/filter-and-sort/FilterSection";
import { GRADE_MAX, GRADE_MIN, gradeToLetter } from "~/utils/grades";

import { RangeSliderField } from "./RangeSliderField";
import { SelectInput } from "./SelectInput";

const gradeOptions = Array.from(
  { length: GRADE_MAX - GRADE_MIN + 1 },
  (_, i) => GRADE_MIN + i,
)
  .reverse()
  .map((v) => (
    <option key={v} value={v}>
      {gradeToLetter(v)}
    </option>
  ));

const gradeOptionsReversed = [...gradeOptions].reverse();

/**
 * Grade range selector with from/to letter grade dropdowns and range slider.
 * AIDEV-NOTE: Spec requires BOTH dropdowns and slider - dual control pattern
 * @param props - Component props
 * @param props.defaultValues - Default [min, max] grade values
 * @param props.label - Field label text
 * @param props.onClear - Handler for clear action (resets to full range)
 * @param props.onGradeChange - Handler for grade range changes
 * @returns Grade range selector with dropdowns and slider, wrapped in FilterSection
 */
export function GradeField({
  defaultValues,
  label,
  onClear,
  onGradeChange,
}: {
  defaultValues: [number, number] | undefined;
  label: string;
  onClear?: () => void;
  onGradeChange: (values: [number, number]) => void;
}): React.JSX.Element {
  const [minValue, setMinValue] = useState(defaultMinValue(defaultValues));
  const [maxValue, setMaxValue] = useState(defaultMaxValue(defaultValues));

  // AIDEV-NOTE: Sync internal state when defaultValues changes (e.g., when cleared via applied filters)
  useEffect(() => {
    setMinValue(defaultMinValue(defaultValues));
    setMaxValue(defaultMaxValue(defaultValues));
  }, [defaultValues]);

  const handleMinChange = (value: string): void => {
    const newMin = Number.parseInt(value, 10);
    setMinValue(newMin);

    if (newMin <= maxValue) {
      onGradeChange([newMin, maxValue]);
    } else {
      onGradeChange([maxValue, newMin]);
    }
  };

  const handleMaxChange = (value: string): void => {
    const newMax = Number.parseInt(value, 10);
    setMaxValue(newMax);

    if (minValue <= newMax) {
      onGradeChange([minValue, newMax]);
    } else {
      onGradeChange([newMax, minValue]);
    }
  };

  // AIDEV-NOTE: Handle slider changes - updates dropdowns bidirectionally
  const handleSliderChange = (from: number, to: number): void => {
    setMinValue(from);
    setMaxValue(to);
    onGradeChange([from, to]);
  };

  // AIDEV-NOTE: When onClear is provided the parent owns the full reset — calling
  // onGradeChange([min, max]) here too would produce a duplicate dispatch (same
  // pattern as RangeSliderField). Local state is still reset immediately for UI.
  const handleClear = (): void => {
    setMinValue(GRADE_MIN);
    setMaxValue(GRADE_MAX);
    if (onClear) {
      onClear();
    } else {
      onGradeChange([GRADE_MIN, GRADE_MAX]);
    }
  };

  return (
    <FilterSection title={label}>
      <div className="flex flex-col gap-4">
        <fieldset aria-label={label} className="text-subtle">
          <div className="flex flex-wrap items-baseline">
            <label className="flex flex-1 items-center gap-x-[.5ch]">
              <span className="min-w-10 text-left text-sm tracking-serif-wide">
                From
              </span>
              <SelectInput
                defaultValue={minValue}
                onChange={(e) => handleMinChange(e.target.value)}
              >
                {[...gradeOptionsReversed]}
              </SelectInput>
            </label>
            <label className="flex flex-1 items-center">
              <span className="min-w-10 text-center text-sm tracking-serif-wide">
                to
              </span>
              <SelectInput
                defaultValue={maxValue}
                onChange={(e) => handleMaxChange(e.target.value)}
              >
                {[...gradeOptions]}
              </SelectInput>
            </label>
          </div>
        </fieldset>

        {/* AIDEV-NOTE: Range slider beneath dropdowns - syncs bidirectionally */}
        <RangeSliderField
          formatValue={gradeToLetter}
          fromValue={minValue}
          label={label}
          max={GRADE_MAX}
          min={GRADE_MIN}
          onChange={handleSliderChange}
          onClear={handleClear}
          toValue={maxValue}
        />
      </div>
    </FilterSection>
  );
}

function defaultMaxValue(selectedValues?: [number, number]): number {
  return selectedValues ? selectedValues[1] : GRADE_MAX;
}

function defaultMinValue(selectedValues?: [number, number]): number {
  return selectedValues ? selectedValues[0] : GRADE_MIN;
}
