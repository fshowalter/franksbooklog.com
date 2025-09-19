import type { ComponentProps } from "react";

import { GradeField } from "~/components/fields/GradeField";
import { YearField } from "~/components/fields/YearField";

import { WorkFilters } from "./WorkFilters";

/**
 * Props for ReviewedWorkFilters component, extending WorkFilters props
 * with additional review-specific filter options.
 */
type Props = ComponentProps<typeof WorkFilters> & {
  /** Grade range filter configuration */
  grade: {
    defaultValues?: [number, number];
    onChange: (values: [number, number]) => void;
  };
  /** Review year range filter configuration */
  reviewYear: {
    defaultValues?: [string, string];
    onChange: (values: [string, string]) => void;
    values: readonly string[];
  };
};

/**
 * Renders filter controls for reviewed work listings.
 * Extends WorkFilters with additional review-specific filters including
 * grade range and review year range. Composes the base work filters
 * with review-specific filter controls.
 *
 * @param props - The component props extending WorkFilters props
 * @param props.grade - Grade range filter configuration
 * @param props.reviewYear - Review year range filter configuration
 * @returns A JSX fragment containing all reviewed work filter controls
 */
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
          defaultValues={reviewYear.defaultValues}
          label="Review Year"
          onYearChange={reviewYear.onChange}
          years={reviewYear.values}
        />
      )}
      {grade && (
        <GradeField
          defaultValues={grade.defaultValues}
          label="Grade"
          onGradeChange={grade.onChange}
        />
      )}
    </>
  );
}
