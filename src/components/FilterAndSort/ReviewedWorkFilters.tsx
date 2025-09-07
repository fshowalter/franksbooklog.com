import type { ComponentProps } from "react";

import { GradeField } from "~/components/Fields/GradeField";
import { YearField } from "~/components/Fields/YearField";

import type { ReviewedWorkFiltersValues } from "./ReviewedWorkFilters.reducer";

import { WorkFilters } from "./WorkFilters";

type Props = ComponentProps<typeof WorkFilters> & {
  grade: {
    initialValue: ReviewedWorkFiltersValues["gradeValue"];
    onChange: (values: [number, number]) => void;
  };
  reviewYear: {
    initialValue: ReviewedWorkFiltersValues["reviewYear"];
    onChange: (values: [string, string]) => void;
    values: readonly string[];
  };
};

export function ReviewedWorkFilters({
  grade,
  kind,
  reviewYear,
  title,
  workYear,
}: Props): React.JSX.Element {
  return (
    <>
      <WorkFilters kind={kind} title={title} workYear={workYear} />
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
    </>
  );
}
