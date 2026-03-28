import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";

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

type FilterChip = {
  displayText: string; // Pre-assembled display string (e.g., "Novel", "Grade: A- to B+", "Search: dune")
  key: string;
  value: string | undefined;
};

type Props = {
  filters: FilterChip[];
  onClearAll: () => void;
  onRemove: (key: string, value: string | undefined) => void;
};

export function AppliedFiltersSection({
  filters,
  onClearAll,
  onRemove,
}: Props): false | React.JSX.Element {
  // Don't render anything if no filters are active
  if (filters.length === 0) {
    return false;
  }

  return (
    <AnimatedDetailsDisclosure title="Applied Filters">
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
              key={`${filter.key}-${filter.value}`}
              onClick={() => onRemove(filter.key, filter.value)}
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
    </AnimatedDetailsDisclosure>
  );
}
