import { useEffect, useState } from "react";

import { FilterSection } from "~/components/filter-and-sort/FilterSection";
import { GRADE_MAX, GRADE_MIN, gradeToLetter } from "~/utils/grades";

import { RangeSliderField } from "./RangeSliderField";
import { SelectInput } from "./SelectInput";

const gradeOptions = [
  <option key={16} value={16}>
    A+
  </option>,
  <option key={15} value={15}>
    A
  </option>,
  <option key={14} value={14}>
    A-
  </option>,
  <option key={13} value={13}>
    B+
  </option>,
  <option key={12} value={12}>
    B
  </option>,
  <option key={11} value={11}>
    B-
  </option>,
  <option key={10} value={10}>
    C+
  </option>,
  <option key={9} value={9}>
    C
  </option>,
  <option key={8} value={8}>
    C-
  </option>,
  <option key={7} value={7}>
    D+
  </option>,
  <option key={6} value={6}>
    D
  </option>,
  <option key={5} value={5}>
    D-
  </option>,
  <option key={4} value={4}>
    F+
  </option>,
  <option key={3} value={3}>
    F
  </option>,
  <option key={2} value={2}>
    F-
  </option>,
];

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

  // AIDEV-NOTE: Clear resets to full range (F- to A+) AND calls onClear callback
  // The onClear callback dispatches removeAppliedFilter to immediately update
  // the Applied Filters section (removes the filter from both pending and active)
  const handleClear = (): void => {
    setMinValue(GRADE_MIN);
    setMaxValue(GRADE_MAX);
    onGradeChange([GRADE_MIN, GRADE_MAX]);
    if (onClear) {
      onClear();
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
                {[...gradeOptions].reverse()}
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
