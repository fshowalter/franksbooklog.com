import { FilterSection } from "./FilterSection";

/**
 * AppliedFilters component displays active filters as removable chips
 * with a "Clear all" option. Hidden when no filters are active.
 *
 * Features:
 * - Individual chip removal via × button
 * - "Clear all" link to remove all filters
 * - Full keyboard support (Tab to chip, Enter/Space to remove)
 * - Proper ARIA attributes for accessibility
 * - Automatically hidden when filters array is empty
 */

export type FilterChip = {
  category: string; // Display category (e.g., "Kind", "Search")
  displayText: string; // Pre-assembled display string (e.g., "Novel", "Grade: A- to B+", "Search: dune")
  id: string; // Unique identifier (e.g., "kind-novel", "title")
  label: string; // Raw display value (e.g., "Novel", "dune")
};

type AppliedFiltersProps = {
  filters: FilterChip[];
  onClearAll: () => void;
  onRemove: (id: string) => void;
};

export function AppliedFilters({
  filters,
  onClearAll,
  onRemove,
}: AppliedFiltersProps): React.JSX.Element | undefined {
  // Don't render anything if no filters are active
  if (filters.length === 0) {
    return undefined;
  }

  return (
    <FilterSection title="Applied Filters">
      <div className="mb-3 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const { displayText } = filter;

          return (
            <button
              aria-label={`Remove ${displayText} filter`}
              className="
                inline-flex items-center gap-2 rounded-sm border border-default
                bg-canvas px-3 py-1.5 font-sans text-sm text-default
                transition-colors
                hover:border-accent hover:bg-accent
                focus:border-accent focus:bg-accent focus:outline-none
              "
              key={filter.id}
              onClick={() => onRemove(filter.id)}
              type="button"
            >
              <span>{displayText}</span>
              <span aria-hidden="true">×</span>
            </button>
          );
        })}
      </div>

      <button
        className="font-sans text-sm text-accent underline"
        onClick={onClearAll}
        type="button"
      >
        Clear all
      </button>
    </FilterSection>
  );
}
