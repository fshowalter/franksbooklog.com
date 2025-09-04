export function WorkSortOptions({
  options,
}: {
  options: ("grade" | "review-date" | "title" | "work-year")[];
}): React.JSX.Element {
  return (
    <>
      {options.includes("title") && (
        <>
          <option value="title-asc">Title (A &rarr; Z)</option>
          <option value="title-desc">Title (Z &rarr; A)</option>
        </>
      )}
      {options.includes("grade") && (
        <>
          <option value="grade-desc">Grade (Best First)</option>
          <option value="grade-asc">Grade (Worst First)</option>
        </>
      )}
      {options.includes("work-year") && (
        <>
          <option value="work-year-desc">Work Year (Newest First)</option>
          <option value="work-year-asc">Work Year (Oldest First)</option>
        </>
      )}
      {options.includes("review-date") && (
        <>
          <option value="review-date-desc">Review Date (Newest First)</option>
          <option value="review-date-asc">Review Date (Oldest First)</option>
        </>
      )}
    </>
  );
}
