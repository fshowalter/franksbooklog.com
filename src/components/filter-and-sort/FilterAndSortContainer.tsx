import { useCallback, useEffect, useRef, useState } from "react";

import type { FilterChip } from "./AppliedFilters";

import { AppliedFilters } from "./AppliedFilters";
import { FilterAndSortHeader } from "./FilterAndSortHeader";
import { FilterSection } from "./FilterSection";

/**
 * Sort option configuration.
 */
export type SortOption = {
  label: string;
  value: string;
};

/**
 * Props for sort functionality.
 */
export type SortProps<T extends string> = {
  currentSortValue: T;
  onSortChange: (value: T) => void;
  sortOptions: readonly SortOption[];
};

type Props<T extends string> = {
  activeFilters?: FilterChip[];
  children: React.ReactNode;
  className?: string;
  filters: React.ReactNode;
  hasPendingFilters: boolean;
  headerLink?: { href: string; text: string };
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onFilterDrawerOpen: () => void;
  onRemoveFilter?: (id: string) => void;
  onResetFilters: () => void;
  pendingFilteredCount: number;
  sideNav?: React.ReactNode;
  sortProps: SortProps<T>;
  topNav?: React.ReactNode;
  totalCount: number;
};

/**
 * Reusable container component for lists with filtering and sorting capabilities.
 * Provides a drawer-based filter UI and sort dropdown with responsive behavior.
 * @param props - Component properties
 * @returns Filter and sort container with drawer and header controls
 */
export function FilterAndSortContainer<T extends string>({
  activeFilters,
  children,
  className,
  filters,
  hasPendingFilters,
  headerLink,
  onApplyFilters,
  onClearFilters,
  onFilterDrawerOpen,
  onRemoveFilter,
  onResetFilters,
  pendingFilteredCount,
  sideNav,
  sortProps,
  topNav,
  totalCount,
}: Props<T>): React.JSX.Element {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  // AIDEV-NOTE: displayedChips is snapshotted from activeFilters when the drawer opens.
  // This prevents newly-selected pending filters from appearing in Applied Filters until
  // "View Results" is clicked, avoiding layout shift. Chip removal mutates displayedChips
  // immediately so the chip disappears at once, but activeFilterValues (and thus the list)
  // only update when "View Results" is clicked.
  const [displayedChips, setDisplayedChips] = useState<FilterChip[]>([]);
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const prevSortValueRef = useRef<T>(sortProps.currentSortValue);
  // AIDEV-NOTE: Used to suppress the useEffect scroll when sort changes via the mobile drawer,
  // since the drawer's "View Results" handler scrolls explicitly.
  const suppressSortScrollRef = useRef(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const handleCloseDrawer = useCallback(
    (shouldResetFilters = true) => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("overflow-hidden");
      }
      setFilterDrawerVisible(false);
      if (shouldResetFilters) {
        onResetFilters();
        formRef?.current?.reset();
      }
    },
    [onResetFilters, formRef],
  );

  const onFilterClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      if (filterDrawerVisible) {
        handleCloseDrawer();
      } else {
        if (typeof document !== "undefined") {
          document.body.classList.add("overflow-hidden");
        }
        setFilterDrawerVisible(true);
        setDisplayedChips(activeFilters ?? []);
        // Call onFilterDrawerOpen when opening
        onFilterDrawerOpen();
        // Focus first focusable element after drawer opens
        requestAnimationFrame(() => {
          const firstFocusable = filtersRef.current?.querySelector<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          );
          firstFocusable?.focus();
        });
      }
    },
    [activeFilters, filterDrawerVisible, handleCloseDrawer, onFilterDrawerOpen],
  );

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && filterDrawerVisible) {
        handleCloseDrawer();
        toggleButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return (): void => document.removeEventListener("keydown", handleKeyDown);
  }, [filterDrawerVisible, handleCloseDrawer]);

  // Scroll to top of list when sort changes via desktop select
  useEffect(() => {
    if (prevSortValueRef.current !== sortProps.currentSortValue) {
      prevSortValueRef.current = sortProps.currentSortValue;
      if (suppressSortScrollRef.current) {
        suppressSortScrollRef.current = false;
      } else {
        listRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [sortProps.currentSortValue]);

  return (
    <div
      className={`
        ${className || ""}
      `}
    >
      {topNav && topNav}
      <div className={`group/list-with-filters mx-auto bg-subtle`}>
        <div
          className={`
            sticky top-0 z-15 scroll-mt-0 border-b border-default bg-default
            text-xs
            tablet:col-span-full
          `}
        >
          <FilterAndSortHeader
            filterDrawerVisible={filterDrawerVisible}
            headerLink={headerLink}
            onFilterClick={onFilterClick}
            sortProps={sortProps}
            toggleButtonRef={toggleButtonRef}
            totalCount={totalCount}
          />
        </div>
        <div className="flex flex-row-reverse">
          {sideNav && sideNav}

          <div
            className={`
              mx-auto max-w-(--breakpoint-desktop) grow
              scroll-mt-(--filter-and-sort-container-scroll-offset,0px) pb-10
              [--filter-and-sort-container-scroll-offset:89px]
              tablet:px-container
              tablet:[--filter-and-sort-container-scroll-offset:97px]
            `}
            id="list"
            ref={listRef}
          >
            {children}
          </div>

          {/* Backdrop for filters */}
          <div
            aria-hidden="true"
            className={`
              invisible fixed inset-0 bg-[rgba(0,0,0,.4)] opacity-0
              transition-opacity duration-200
              ${
                filterDrawerVisible
                  ? `visible z-side-drawer-backdrop opacity-100`
                  : ""
              }
            `}
            onClick={() => {
              handleCloseDrawer();
            }}
          />

          <div
            aria-label="Filters"
            className={`
              fixed top-0 right-0 z-filter-drawer flex h-full max-w-[380px]
              flex-col items-start gap-y-5 bg-default text-left duration-200
              ease-in-out
              ${
                filterDrawerVisible
                  ? `
                    bottom-0 w-full transform-[translateX(0)] overflow-y-auto
                    drop-shadow-2xl
                  `
                  : `w-0 transform-[translateX(100%)] overflow-y-hidden`
              }
              tablet:gap-y-10
            `}
            id="filters"
            ref={filtersRef}
          >
            <form
              className={`
                flex size-full flex-col text-sm
                tablet:text-base
              `}
              ref={formRef}
            >
              {/* Close button */}
              <button
                aria-label="Close filters"
                className={`
                  absolute top-7 right-4 z-10 flex size-10 transform-gpu
                  cursor-pointer items-center justify-center rounded-full
                  bg-canvas text-default drop-shadow-sm transition-transform
                  hover:scale-105 hover:drop-shadow-md
                  tablet:right-[34px]
                `}
                onClick={() => {
                  handleCloseDrawer();
                  toggleButtonRef.current?.focus();
                }}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="size-4 transform-gpu"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 28 28"
                >
                  <path
                    d="M7 21L21 7M7 7l14 14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <fieldset className={`mt-0 flex grow-0 flex-col`}>
                <legend
                  className={`
                    mb-0 block w-full px-container py-7 font-sans text-base/10
                    font-bold tracking-wide text-subtle uppercase shadow-bottom
                    tablet-landscape:px-12
                  `}
                >
                  Filter
                </legend>

                <div
                  className="
                    px-container
                    tablet-landscape:px-12
                  "
                >
                  {onRemoveFilter && displayedChips.length > 0 && (
                    <AppliedFilters
                      filters={displayedChips}
                      onClearAll={() => {
                        setDisplayedChips([]);
                        onClearFilters();
                      }}
                      onRemove={(id) => {
                        setDisplayedChips((prev) =>
                          prev.filter((c) => c.id !== id),
                        );
                        onRemoveFilter(id);
                      }}
                    />
                  )}
                  {/* AIDEV-NOTE: Sort section in mobile drawer only (<640px).
                      Uncontrolled radios — value read from form on "View Results" click.
                      Desktop dropdown in header applies sort immediately. */}
                  <div className="tablet:hidden">
                    <FilterSection defaultOpen={true} title="Sort by">
                      <div className="space-y-3">
                        {sortProps.sortOptions.map(({ label, value }) => (
                          <label
                            className="flex cursor-pointer items-center gap-3"
                            key={value}
                          >
                            <input
                              className="size-4 cursor-pointer accent-accent"
                              defaultChecked={
                                sortProps.currentSortValue === value
                              }
                              name="sort"
                              type="radio"
                              value={value}
                            />
                            <span className="text-sm">{label}</span>
                          </label>
                        ))}
                      </div>
                    </FilterSection>
                  </div>
                  {filters}
                </div>
              </fieldset>
              <div
                className={`
                  sticky bottom-0 z-filter-footer mt-auto w-full border-t
                  border-t-default bg-default px-8 py-4 drop-shadow-2xl
                  tablet-landscape:px-12
                `}
              >
                <div className="flex gap-x-4">
                  <button
                    aria-label="Clear all filters"
                    className={`
                      flex items-center justify-center gap-x-4 rounded-sm
                      bg-canvas px-4 py-3 font-sans text-xs text-nowrap
                      uppercase transition-transform
                      ${
                        hasPendingFilters
                          ? `
                            cursor-pointer text-default
                            enabled:hover:scale-105 enabled:hover:drop-shadow-md
                          `
                          : "cursor-not-allowed text-muted opacity-50"
                      }
                    `}
                    disabled={!hasPendingFilters}
                    onClick={() => {
                      if (hasPendingFilters) {
                        onClearFilters?.();
                      }
                    }}
                    type="reset"
                  >
                    Clear
                  </button>
                  <button
                    className={`
                      flex flex-1 transform-gpu items-center justify-center
                      gap-x-4 rounded-sm bg-footer px-4 py-3 font-sans text-xs
                      font-bold tracking-wide text-nowrap text-white uppercase
                      transition-transform
                      ${
                        pendingFilteredCount === 0
                          ? "cursor-not-allowed text-muted opacity-50"
                          : `
                            cursor-pointer
                            hover:scale-105 hover:drop-shadow-md
                          `
                      }
                    `}
                    disabled={pendingFilteredCount === 0}
                    onClick={() => {
                      const formData = new FormData(formRef.current!);
                      const sortValue = formData.get("sort") as T;
                      suppressSortScrollRef.current = true;
                      sortProps.onSortChange(sortValue);
                      onApplyFilters();
                      handleCloseDrawer(false); // Don't reset filters/sort when applying
                      listRef.current?.scrollIntoView();
                    }}
                    type="button"
                  >
                    View {pendingFilteredCount} Results
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
