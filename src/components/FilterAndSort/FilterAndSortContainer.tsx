import { useCallback, useEffect, useRef, useState } from "react";

import { FilterAndSortHeader } from "./FilterAndSortHeader";

const DRAWER_OPEN_ANIMATION_MS = 400;

export type SortProps<T extends string> = {
  currentSortValue: T;
  onSortChange: React.ChangeEventHandler<HTMLSelectElement>;
  sortOptions: React.ReactNode;
};

type Props<T extends string> = {
  children: React.ReactNode;
  className?: string;
  filters: React.ReactNode;
  hasActiveFilters: boolean;
  headerLinks?: React.ReactNode;
  onApplyFilters?: () => void;
  onClearFilters?: () => void;
  onFilterDrawerOpen?: () => void;
  onResetFilters?: () => void;
  pendingFilteredCount?: number;
  sortProps: SortProps<T>;
  topNav?: React.ReactNode;
  totalCount: number;
};

export function FilterAndSortContainer<T extends string>({
  children,
  className,
  filters,
  hasActiveFilters,
  headerLinks,
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
  const [isOpening, setIsOpening] = useState(false);
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const timeoutRefs = useRef<Set<NodeJS.Timeout>>(new Set());
  const prevSortValueRef = useRef<T>(sortProps.currentSortValue);

  const handleCloseDrawer = useCallback(
    (shouldResetFilters = true) => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("overflow-hidden");
      }
      setFilterDrawerVisible(false);
      if (shouldResetFilters) {
        onResetFilters?.();
      }
    },
    [onResetFilters],
  );

  const onFilterClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      if (filterDrawerVisible) {
        handleCloseDrawer();
      } else {
        setIsOpening(true);
        if (typeof document !== "undefined") {
          document.body.classList.add("overflow-hidden");
        }
        setFilterDrawerVisible(true);
        // Call onFilterDrawerOpen when opening
        onFilterDrawerOpen?.();
        // Clear the opening state after animation completes
        const timeoutId = setTimeout(() => {
          setIsOpening(false);
          timeoutRefs.current.delete(timeoutId);
        }, DRAWER_OPEN_ANIMATION_MS);
        timeoutRefs.current.add(timeoutId);
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

  // Cleanup timeouts on unmount
  useEffect(() => {
    return (): void => {
      for (const timeoutId of timeoutRefs.current) clearTimeout(timeoutId);
      timeoutRefs.current.clear();
    };
  }, []);

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
      if (typeof document !== "undefined") {
        document.querySelector("#list")?.scrollIntoView({ behavior: "smooth" });
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
            sticky top-[calc(0px_+_var(--scroll-offset,0px))] z-10
            scroll-mt-[calc(0px_+_var(--scroll-offset,0px))] border-b
            border-default bg-default text-xs
            tablet:col-span-full
          `}
        >
          <FilterAndSortHeader
            filterDrawerVisible={filterDrawerVisible}
            headerLinks={headerLinks}
            onFilterClick={onFilterClick}
            sortProps={sortProps}
            toggleButtonRef={toggleButtonRef}
            totalCount={totalCount}
          />
        </div>
        <div
          className={`
            mx-auto max-w-[var(--breakpoint-desktop)]
            tablet:px-container
          `}
        >
          <div
            className={`
              mx-auto max-w-[var(--breakpoint-desktop)] grow
              scroll-mt-[calc(var(--filter-and-sort-container-scroll-offset)_+_var(--scroll-offset,0px))]
              pb-10
              [--filter-and-sort-container-scroll-offset:181px]
              tablet:[--filter-and-sort-container-scroll-offset:121px]
            `}
            id="list"
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
              flex-col items-start gap-y-5 bg-default text-left text-inverse
              duration-200 ease-in-out
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
            <div
              className={`
                flex h-full w-full flex-col text-sm
                tablet:text-base
                [@media(min-height:815px)]:pt-12
              `}
            >
              {/* Close button */}
              <button
                aria-label="Close filters"
                className={`
                  absolute top-7 right-4 z-10 flex h-10 w-10 transform-gpu
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
                  className={`
                    h-4 w-4 transform-gpu
                    ${isOpening ? "animate-spin-wind-up" : ""}
                  `}
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
                      enabled:hover:scale-105 enabled:hover:drop-shadow-md
                      ${
                        hasActiveFilters
                          ? "cursor-pointer text-default"
                          : "cursor-not-allowed text-muted opacity-50"
                      }
                    `}
                    disabled={hasActiveFilters ? undefined : false}
                    onClick={() => {
                      if (hasActiveFilters) {
                        onClearFilters?.();
                      }
                    }}
                    type="button"
                  >
                    Clear
                  </button>
                  <button
                    className={`
                      flex flex-1 transform-gpu cursor-pointer items-center
                      justify-center gap-x-4 rounded-sm bg-footer px-4 py-3
                      font-sans text-xs font-bold tracking-wide text-nowrap
                      text-inverse uppercase transition-transform
                      hover:scale-105 hover:drop-shadow-md
                    `}
                    onClick={() => {
                      // Apply pending filters
                      onApplyFilters?.();
                      handleCloseDrawer(false); // Don't reset filters when applying
                      if (typeof document !== "undefined") {
                        document.querySelector("#list")?.scrollIntoView();
                      }
                    }}
                    type="button"
                  >
                    View{" "}
                    {pendingFilteredCount === undefined
                      ? totalCount
                      : pendingFilteredCount}{" "}
                    Results
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
