import { useState } from "react";

import { LabelText } from "~/components/LabelText";
import { SelectInput } from "~/components/SelectInput";

const gradeOptions = [
  <option key={13} value={13}>
    A+
  </option>,
  <option key={12} value={12}>
    A
  </option>,
  <option key={11} value={11}>
    A-
  </option>,
  <option key={10} value={10}>
    B+
  </option>,
  <option key={9} value={9}>
    B
  </option>,
  <option key={8} value={8}>
    B-
  </option>,
  <option key={7} value={7}>
    C+
  </option>,
  <option key={6} value={6}>
    C
  </option>,
  <option key={5} value={5}>
    C-
  </option>,
  <option key={4} value={4}>
    D+
  </option>,
  <option key={3} value={3}>
    D
  </option>,
  <option key={2} value={2}>
    D-
  </option>,
  <option key={1} value={1}>
    F
  </option>,
];

export function GradeField({
  initialValues,
  label,
  onGradeChange,
}: {
  initialValues: number[] | undefined;
  label: string;
  onGradeChange: (values: [number, number]) => void;
}): React.JSX.Element {
  const [minValue, setMinValue] = useState(
    initialValues && initialValues.length > 0 ? initialValues[0] : 1,
  );
  const [maxValue, setMaxValue] = useState(
    initialValues && initialValues.length > 1 ? initialValues[1] : 13,
  );

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

  return (
    <fieldset className="text-subtle">
      <LabelText as="legend" value={label} />
      <div className="flex flex-wrap items-baseline">
        <label className="flex flex-1 items-center gap-x-[.5ch]">
          <span className="min-w-10 text-left text-sm tracking-serif-wide">
            From
          </span>
          <SelectInput
            onChange={(e) => handleMinChange(e.target.value)}
            value={minValue}
          >
            {[...gradeOptions].reverse()}
          </SelectInput>
        </label>
        <label className="flex flex-1 items-center">
          <span className="min-w-10 text-center text-sm tracking-serif-wide">
            to
          </span>
          <SelectInput
            onChange={(e) => handleMaxChange(e.target.value)}
            value={maxValue}
          >
            {[...gradeOptions]}
          </SelectInput>
        </label>
      </div>
    </fieldset>
  );
}
