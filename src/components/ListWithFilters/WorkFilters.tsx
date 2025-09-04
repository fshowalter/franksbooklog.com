import { GradeField } from "~/components/Fields/GradeField";
import { SelectField } from "~/components/Fields/SelectField";
import { SelectOptions } from "~/components/Fields/SelectOptions";
import { TextField } from "~/components/Fields/TextField";
import { YearField } from "~/components/Fields/YearField";

import type { WorkFilterValues } from "./worksReducerUtils";

export function WorkFilters({
  grade,
  kind,
  reviewYear,
  title,
  workYear,
}: {
  grade?: {
    initialValue: WorkFilterValues["grade"];
    onChange: (values: [number, number]) => void;
  };
  kind?: {
    initialValue: WorkFilterValues["kind"];
    onChange: (value: string) => void;
    values: readonly string[];
  };
  reviewYear?: {
    initialValue: WorkFilterValues["reviewYear"];
    onChange: (values: [string, string]) => void;
    values: readonly string[];
  };
  title?: {
    initialValue: WorkFilterValues["title"];
    onChange: (value: string) => void;
  };
  workYear?: {
    initialValue: WorkFilterValues["workYear"];
    onChange: (values: [string, string]) => void;
    values: readonly string[];
  };
}): React.JSX.Element {
  return (
    <>
      {title && (
        <TextField
          initialValue={title.initialValue}
          label="Title"
          onInputChange={title.onChange}
          placeholder="Enter all or part of a title"
        />
      )}
      {workYear && (
        <YearField
          initialValues={workYear.initialValue}
          label="Work Year"
          onYearChange={workYear.onChange}
          years={workYear.values}
        />
      )}
      {reviewYear && (
        <YearField
          initialValues={reviewYear.initialValue}
          label="Review Year"
          onYearChange={reviewYear.onChange}
          years={reviewYear.values}
        />
      )}
      {grade && (
        <GradeField
          initialValues={grade.initialValue}
          label="Grade"
          onGradeChange={grade.onChange}
        />
      )}
      {kind && (
        <SelectField
          initialValue={kind.initialValue}
          label="Kind"
          onChange={kind.onChange}
        >
          <SelectOptions options={kind.values} />
        </SelectField>
      )}
    </>
  );
}
