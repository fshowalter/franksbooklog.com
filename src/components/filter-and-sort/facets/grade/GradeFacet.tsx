import type { GradeValue } from "~/utils/grades";

import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { RangeSliderField } from "~/components/filter-and-sort/fields/RangeSliderField";
import { SelectInput } from "~/components/filter-and-sort/fields/SelectInput";
import {
  GRADE_MAX,
  GRADE_MIN,
  GRADE_VALUE_TO_LETTER,
  gradeValueToLetter,
} from "~/utils/grades";

import type { GradeFilterChangedAction } from "./gradeReducer";

import { createGradeFilterChangedAction } from "./gradeReducer";

const gradeOptions = Object.entries(GRADE_VALUE_TO_LETTER)
  .filter((entry) => entry.at(1) !== "Abandoned")
  .map(([key, value]) => (
    <option key={key} value={Number(key)}>
      {value}
    </option>
  ));

const gradeOptionsReversed = [...gradeOptions].reverse();

export function GradeFacet({
  dispatch,
  gradeValues,
}: {
  dispatch: React.Dispatch<GradeFilterChangedAction>;
  gradeValues: [GradeValue, GradeValue] | undefined;
}): React.JSX.Element {
  const onGradeChange = (values: [GradeValue, GradeValue]): void =>
    dispatch(createGradeFilterChangedAction(values));

  const handleMinChange = (value: string): void => {
    const newMin = Number.parseInt(value, 10) as GradeValue;

    if (newMin <= maxValue(gradeValues)) {
      onGradeChange([newMin, maxValue(gradeValues)]);
    } else {
      onGradeChange([maxValue(gradeValues), newMin]);
    }
  };

  const handleMaxChange = (value: string): void => {
    const newMax = Number.parseInt(value, 10) as GradeValue;

    if (minValue(gradeValues) <= newMax) {
      onGradeChange([minValue(gradeValues), newMax]);
    } else {
      onGradeChange([newMax, minValue(gradeValues)]);
    }
  };

  // Handle slider changes - updates dropdowns bidirectionally
  const handleSliderChange = (from: GradeValue, to: GradeValue): void => {
    onGradeChange([from, to]);
  };

  const handleClear = (): void => {
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
                defaultValue={minValue(gradeValues)}
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
                defaultValue={maxValue(gradeValues)}
                onChange={(e) => handleMaxChange(e.target.value)}
              >
                {[...gradeOptions]}
              </SelectInput>
            </label>
          </div>
        </fieldset>

        {/* Range slider beneath dropdowns - syncs bidirectionally */}
        <RangeSliderField
          formatValue={gradeValueToLetter}
          fromValue={minValue(gradeValues)}
          label={"Grade"}
          max={GRADE_MAX}
          min={GRADE_MIN}
          onChange={handleSliderChange}
          onClear={handleClear}
          toValue={maxValue(gradeValues)}
        />
      </div>
    </AnimatedDetailsDisclosure>
  );
}

function maxValue(selectedValues?: [GradeValue, GradeValue]): GradeValue {
  return selectedValues ? selectedValues[1] : GRADE_MAX;
}

function minValue(selectedValues?: [GradeValue, GradeValue]): GradeValue {
  return selectedValues ? selectedValues[0] : GRADE_MIN;
}
