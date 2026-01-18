import { useCallback, useEffect, useRef, useState } from "react";

import { FilterAndSortHeader } from "./FilterAndSortHeader";

/**
 * Props for sort functionality.
 */
export type SortProps<T extends string> = {
  currentSortValue: T;
  onSortChange: React.ChangeEventHandler<HTMLSelectElement>;
  sortOptions: React.ReactNode;
};

/**
 * Props for the FilterAndSortContainer component.
 */
type Props<T extends string> = {
  /** Content to render inside the container */
  children: React.ReactNode;
  /** Optional CSS class name for styling */
  className?: string;
  /** Filter controls to display in the drawer */
  filters: React.ReactNode;
  /** Whether there are pending filter changes not yet applied */
  hasPendingFilters: boolean;
  /** Optional header link configuration */
  headerLink?: {
    href: string;
    text: string;
  };
  /** Callback when filters are applied */
  onApplyFilters: () => void;
  /** Callback when filters are cleared */
  onClearFilters: () => void;
  /** Callback when filter drawer is opened */
  onFilterDrawerOpen: () => void;
  /** Callback when filters are reset */
  onResetFilters: () => void;
  /** Count of items after pending filters would be applied */
  pendingFilteredCount: number;
  /** Sort control properties */
  sortProps: SortProps<T>;
  /** Optional navigation element to display at top */
  topNav?: React.ReactNode;
  /** Total count of items before filtering */
  totalCount: number;
};

/**
 * Reusable container component for lists with filtering and sorting capabilities.
 * Provides a drawer-based filter UI and sort dropdown with responsive behavior.
 * @param props - Component properties
 * @returns Filter and sort container with drawer and header controls
 */
export function FilterAndSortContainer<T extends string>({
  children,
  className,
  filters,
  hasPendingFilters,
  headerLink,
  onApplyFilters,
  onClearFilters,
  onFilterDrawerOpen,
  onResetFilters,
  pendingFilteredCount,
  sortProps,
  topNav,
  totalCount,
}: Props<T>): React.JSX.Element {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const prevSortValueRef = useRef<T>(sortProps.currentSortValue);
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
    [filterDrawerVisible, handleCloseDrawer, onFilterDrawerOpen],
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

  // Scroll to top of list when sort changes
  useEffect(() => {
    if (prevSortValueRef.current !== sortProps.currentSortValue) {
      prevSortValueRef.current = sortProps.currentSortValue;
      listRef.current?.scrollIntoView({ behavior: "smooth" });
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
            sticky top-[calc(0px+var(--scroll-offset,0px))] z-20
            scroll-mt-[calc(0px+var(--scroll-offset,0px))] border-b
            border-default bg-default text-xs
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
        <div
          className={`
            mx-auto max-w-(--breakpoint-desktop)
            tablet:px-container
          `}
        >
          <div
            className={`
              mx-auto max-w-(--breakpoint-desktop) grow
              scroll-mt-[calc(var(--filter-and-sort-container-scroll-offset)+var(--scroll-offset,0px))]
              pb-10 [--filter-and-sort-container-scroll-offset:181px]
              tablet:[--filter-and-sort-container-scroll-offset:121px]
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
                [@media(min-height:815px)]:pt-12
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
              <fieldset
                className={`
                  mt-0 flex grow flex-col gap-5 px-container py-10
                  tablet:gap-8
                  tablet-landscape:grow-0 tablet-landscape:gap-10
                  tablet-landscape:px-12
                `}
              >
                <legend
                  className={`
                    block w-full pt-10 pb-8 font-sans text-sm font-bold
                    tracking-wide text-subtle uppercase shadow-bottom
                  `}
                >
                  Filter
                </legend>
                {filters}
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
                    disabled={hasPendingFilters ? false : true}
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
                      font-bold tracking-wide text-nowrap text-inverse uppercase
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
                    disabled={pendingFilteredCount === 0 ? true : false}
                    onClick={() => {
                      // Apply pending filters
                      onApplyFilters();
                      handleCloseDrawer(false); // Don't reset filters when applying
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
