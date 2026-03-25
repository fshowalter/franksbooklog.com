import { useEffect, useState } from "react";

import { AnimatedDetailsDisclosure } from "~/components/react/animated-details-disclosure/AnimatedDetailsDisclosure";
import { RangeSliderField } from "~/components/react/filter-and-sort/fields/RangeSliderField";
import { SelectInput } from "~/components/react/filter-and-sort/fields/SelectInput";
import { GRADE_MAX, GRADE_MIN, gradeToLetter } from "~/utils/grades";

import type { GradeFilterChangedAction } from "./gradeReducer";

import { createGradeFilterChangedAction } from "./gradeReducer";

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

export function GradeFacet({
  defaultValues,
  dispatch,
}: {
  defaultValues: [number, number] | undefined;
  dispatch: React.Dispatch<GradeFilterChangedAction>;
}): React.JSX.Element {
  const [minValue, setMinValue] = useState(defaultMinValue(defaultValues));
  const [maxValue, setMaxValue] = useState(defaultMaxValue(defaultValues));

  const onGradeChange = (values: [number, number]): void =>
    dispatch(createGradeFilterChangedAction(values));

  // Sync internal state when defaultValues changes (e.g., when cleared via applied filters)
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

  // Handle slider changes - updates dropdowns bidirectionally
  const handleSliderChange = (from: number, to: number): void => {
    setMinValue(from);
    setMaxValue(to);
    onGradeChange([from, to]);
  };

  // When onClear is provided the parent owns the full reset — calling
  // onGradeChange([min, max]) here too would produce a duplicate dispatch (same
  // pattern as RangeSliderField). Local state is still reset immediately for UI.
  const handleClear = (): void => {
    setMinValue(GRADE_MIN);
    setMaxValue(GRADE_MAX);
    onGradeChange([GRADE_MIN, GRADE_MAX]);
  };

  return (
    <AnimatedDetailsDisclosure title={"Grade"}>
      <div className="flex flex-col gap-4">
        <fieldset aria-label={"Grade"} className="text-subtle">
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

        {/* Range slider beneath dropdowns - syncs bidirectionally */}
        <RangeSliderField
          formatValue={gradeToLetter}
          fromValue={minValue}
          label={"Grade"}
          max={GRADE_MAX}
          min={GRADE_MIN}
          onChange={handleSliderChange}
          onClear={handleClear}
          toValue={maxValue}
        />
      </div>
    </AnimatedDetailsDisclosure>
  );
}

function defaultMaxValue(selectedValues?: [number, number]): number {
  return selectedValues ? selectedValues[1] : GRADE_MAX;
}

function defaultMinValue(selectedValues?: [number, number]): number {
  return selectedValues ? selectedValues[0] : GRADE_MIN;
}
