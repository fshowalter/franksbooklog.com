/**
 * Renders sort options for collection views (authors, genres, etc.).
 * Provides sorting options for name alphabetically and by review count,
 * in both ascending and descending order.
 *
 * @returns A JSX fragment containing option elements for collection sorting
 */
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
