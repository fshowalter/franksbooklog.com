export function CollectionSortOptions({
  options,
}: {
  options: ("name" | "review-count")[];
}): React.JSX.Element {
  return (
    <>
      {options.includes("name") && (
        <>
          <option value="name-asc">Name (A &rarr; Z)</option>
          <option value="name-desc">Name (Z &rarr; A)</option>
        </>
      )}
      {options.includes("review-count") && (
        <>
          <option value="review-count-desc">Review Count (Most First)</option>
          <option value="review-count-asc">Review Count (Fewest First)</option>
        </>
      )}
    </>
  );
}
