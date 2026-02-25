import type { ComponentProps } from "react";

import { GradeField } from "~/components/fields/GradeField";
import { YearField } from "~/components/fields/YearField";

import { ReviewedStatusFilter } from "./ReviewedStatusFilter";
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
    onClear?: () => void;
  };
  /** Reviewed status filter configuration */
  reviewedStatus?: {
    defaultValues?: readonly string[];
    onChange: (values: string[]) => void;
    onClear?: () => void;
  };
  /** Review year range filter configuration */
  reviewYear: {
    defaultValues?: [string, string];
    onChange: (values: [string, string]) => void;
    onClear?: () => void;
    values: readonly string[];
  };
};

/**
 * Renders filter controls for reviewed work listings.
 * Extends WorkFilters with additional review-specific filters including
 * grade range, review year range, and reviewed/abandoned status.
 *
 * @param props - The component props extending WorkFilters props
 * @param props.grade - Grade range filter configuration
 * @param props.reviewedStatus - Reviewed status filter configuration
 * @param props.reviewYear - Review year range filter configuration
 * @returns A JSX fragment containing all reviewed work filter controls
 */
export function ReviewedWorkFilters({
  grade,
  kind,
  reviewedStatus,
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
          onClear={reviewYear.onClear}
          onYearChange={reviewYear.onChange}
          years={reviewYear.values}
        />
      )}
      {grade && (
        <GradeField
          defaultValues={grade.defaultValues}
          label="Grade"
          onClear={grade.onClear}
          onGradeChange={grade.onChange}
        />
      )}
      {reviewedStatus && (
        <ReviewedStatusFilter
          defaultValues={reviewedStatus.defaultValues}
          excludeNotReviewed
          onChange={reviewedStatus.onChange}
          onClear={reviewedStatus.onClear}
        />
      )}
    </>
  );
}
