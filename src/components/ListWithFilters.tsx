import type { JSX, ReactNode } from "react";

import { useCallback, useEffect, useRef, useState } from "react";

export const DRAWER_CLOSE_ANIMATION_MS = 250;
const DRAWER_OPEN_ANIMATION_MS = 400;

type Props<T extends string> = {
  className?: string;
  dynamicSubNav?: React.ReactNode;
  filters: React.ReactNode;
  hasActiveFilters?: boolean;
  list: React.ReactNode;
  listHeaderButtons?: React.ReactNode;
  onApplyFilters?: () => void;
  onClearFilters?: () => void;
  onFilterDrawerOpen?: () => void;
  onResetFilters?: () => void;
  pendingFilteredCount?: number;
  sortProps: SortProps<T>;
  totalCount: number;
};

type SortProps<T extends string> = {
  currentSortValue: T;
  onSortChange: React.ChangeEventHandler<HTMLSelectElement>;
  sortOptions: React.ReactNode;
};

// This is used by pages directly, keep it exported
export function ListHeaderButton({
  href,
  text,
}: {
  href: string;
  text: string;
}) {
  return (
    <div
      className={`
        flex items-start gap-x-4 bg-default px-4 text-nowrap text-accent
        uppercase
      `}
    >
      <a
        className={`
          relative inline-block transform-gpu py-1 transition-transform
          after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
          after:origin-center after:scale-x-0 after:bg-(--fg-accent)
          after:transition-transform
          hover:after:scale-x-100
        `}
        href={href}
      >
        {text}
      </a>
    </div>
  );
}

export function ListWithFilters<T extends string>({
  className,
  dynamicSubNav,
  filters,
  hasActiveFilters,
  list,
  listHeaderButtons,
  onApplyFilters,
  onClearFilters,
  onFilterDrawerOpen,
  onResetFilters,
  pendingFilteredCount,
  sortProps,
  totalCount,
}: Props<T>): JSX.Element {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const timeoutRefs = useRef<Set<NodeJS.Timeout>>(new Set());
  const prevSortValueRef = useRef<T>(sortProps.currentSortValue);

  const handleCloseDrawer = useCallback(
    (shouldResetFilters = true) => {
      setIsClosing(true);
      // Start the spin animation, then close after a short delay
      const timeoutId = setTimeout(() => {
        if (typeof document !== "undefined") {
          document.body.classList.remove("overflow-hidden");
        }
        setFilterDrawerVisible(false);
        setIsClosing(false);
        if (shouldResetFilters) {
          onResetFilters?.();
        }
        timeoutRefs.current.delete(timeoutId);
      }, DRAWER_CLOSE_ANIMATION_MS);
      timeoutRefs.current.add(timeoutId);
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
    return () => {
      for (const timeoutId of timeoutRefs.current) clearTimeout(timeoutId);
      timeoutRefs.current.clear();
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && filterDrawerVisible && !isClosing) {
        handleCloseDrawer();
        toggleButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filterDrawerVisible, handleCloseDrawer, isClosing]);

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
      {dynamicSubNav}
      <div className={`group/list-with-filters mx-auto bg-subtle`}>
        <div
          className={`
            sticky top-[calc(0px_+_var(--scroll-offset,0px))] z-sticky
            scroll-mt-[calc(0px_+_var(--scroll-offset,0px))] border-b
            border-default bg-default text-xs
            tablet:col-span-full
          `}
        >
          <ListHeader
            filterDrawerVisible={filterDrawerVisible}
            listHeaderButtons={listHeaderButtons}
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
              scroll-mt-[calc(var(--list-scroll-offset)_+_var(--scroll-offset,0px))]
              pb-10
              [--list-scroll-offset:181px]
              tablet:[--list-scroll-offset:121px]
            `}
            id="list"
          >
            {list}
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
              if (!isClosing) {
                handleCloseDrawer();
              }
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
                  bg-canvas text-default drop-shadow-md transition-transform
                  hover:scale-105 hover:drop-shadow-md
                  ${isClosing ? "pointer-events-none" : ""}
                `}
                onClick={() => {
                  if (!isClosing) {
                    handleCloseDrawer();
                    toggleButtonRef.current?.focus();
                  }
                }}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className={`
                    h-4 w-4 transform-gpu
                    ${isClosing ? "animate-spin-recoil" : ""}
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
                  mt-0 flex h-full grow flex-col gap-5 px-container py-10
                  tablet:gap-8
                  tablet-landscape:grow-0 tablet-landscape:gap-12
                  tablet-landscape:px-12
                `}
              >
                <legend
                  className={`
                    block w-full pt-10 pb-8 font-sans text-lg text-xxs
                    font-semibold tracking-wide text-subtle uppercase
                    shadow-bottom
                  `}
                >
                  Filter
                </legend>
                {filters}
              </fieldset>
              <div
                className={`
                  sticky bottom-0 z-filter-footer mt-auto w-full self-end
                  border-t border-t-default bg-default px-8 py-4 drop-shadow-2xl
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
                    disabled={!hasActiveFilters}
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
                      font-sans text-xs text-nowrap text-inverse uppercase
                      transition-transform
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

function ListHeader<T extends string>({
  filterDrawerVisible,
  listHeaderButtons,
  onFilterClick,
  sortProps,
  toggleButtonRef,
  totalCount,
}: {
  filterDrawerVisible: boolean;
  listHeaderButtons?: ReactNode;
  onFilterClick: (event: React.MouseEvent) => void;
  sortProps: SortProps<T>;
  toggleButtonRef: React.RefObject<HTMLButtonElement | null>;
  totalCount: number;
}): JSX.Element {
  const { currentSortValue, onSortChange, sortOptions } = sortProps;

  return (
    <div
      className={`
        mx-auto grid max-w-[var(--breakpoint-desktop)]
        grid-cols-[auto_auto_1fr_auto] items-baseline gap-y-7 px-container py-10
        font-sans font-medium tracking-wide text-subtle uppercase
        tablet:grid-cols-[auto_auto_1fr_auto_auto] tablet:gap-x-4
        tablet-landscape:grid-cols-[auto_auto_1fr_minmax(302px,calc(33%_-_192px))_auto]
        desktop:grid-cols-[auto_auto_1fr_calc(33%_-_96px)_auto]
      `}
    >
      <span className={`text-nowrap`}>
        <span className={`font-semibold text-default`}>
          {totalCount.toLocaleString()}
        </span>
        <span className="text-xxs leading-none tracking-wide"> Results</span>
      </span>
      <div className={``}>{listHeaderButtons && listHeaderButtons}</div>
      <div
        className={`
          col-span-full
          tablet:col-span-1 tablet:col-start-4
          desktop:pl-8
        `}
      >
        <label
          className={`
            flex items-baseline gap-x-4 text-xxs font-semibold tracking-wide
            text-subtle
          `}
        >
          Sort{" "}
          <select
            className={`
              flex w-full appearance-none border-none bg-default py-2 pr-4 pl-4
              font-serif text-base font-normal tracking-normal overflow-ellipsis
              text-default shadow-all outline-accent
            `}
            onChange={onSortChange}
            value={currentSortValue}
          >
            {sortOptions}
          </select>
        </label>
      </div>
      <button
        aria-controls="filters"
        aria-expanded={filterDrawerVisible}
        aria-label="Toggle filters"
        className={`
          col-start-4 row-start-1 flex transform-gpu cursor-pointer items-center
          justify-center gap-x-4 rounded-sm bg-canvas px-4 py-2 font-sans
          text-xs font-medium text-nowrap text-muted uppercase shadow-all
          transition-transform
          hover:scale-110 hover:drop-shadow-md
          tablet:col-start-5 tablet:w-20
        `}
        onClick={onFilterClick}
        ref={toggleButtonRef}
        type="button"
      >
        Filter
      </button>
    </div>
  );
}
