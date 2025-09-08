export function CollectionSortOptions(): React.JSX.Element {
  return (
    <>
      <option value="name-asc">Name (A &rarr; Z)</option>
      <option value="name-desc">Name (Z &rarr; A)</option>
      <option value="review-count-desc">Review Count (Most First)</option>
      <option value="review-count-asc">Review Count (Fewest First)</option>
    </>
  );
}
