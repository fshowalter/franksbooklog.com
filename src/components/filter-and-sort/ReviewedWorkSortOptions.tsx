/**
 * Renders sort options for reviewed works.
 * Provides a complete set of sorting options including title, grade,
 * work year, and review date in both ascending and descending order.
 * 
 * @returns A JSX fragment containing option elements for reviewed work sorting
 */
export function ReviewedWorkSortOptions(): React.JSX.Element {
  return (
    <>
      <option value="title-asc">Title (A &rarr; Z)</option>
      <option value="title-desc">Title (Z &rarr; A)</option>
      <option value="grade-desc">Grade (Best First)</option>
      <option value="grade-asc">Grade (Worst First)</option>
      <option value="work-year-desc">Work Year (Newest First)</option>
      <option value="work-year-asc">Work Year (Oldest First)</option>
      <option value="review-date-desc">Review Date (Newest First)</option>
      <option value="review-date-asc">Review Date (Oldest First)</option>
    </>
  );
}
