import type { ComponentProps } from "react";

import { useCallback, useEffect, useRef, useState } from "react";

import { AnimatedDetailsDisclosure } from "~/components/react/animated-details-disclosure/AnimatedDetailsDisclosure";

import type {
  FilterAndSortContainerAction,
  FilterAndSortContainerState,
} from "./filterAndSortContainerReducer";

import { AppliedFiltersSection } from "./AppliedFiltersSection";
import {
  createApplyFiltersAction,
  createClearFiltersAction,
  createRemoveAppliedFilterAction,
  createResetFiltersAction,
  createSortAction,
  selectHasPendingFilters,
} from "./filterAndSortContainerReducer";
import { FilterAndSortToolbar } from "./FilterAndSortToolbar";

export type FilterChip = ComponentProps<
  typeof AppliedFiltersSection
>["filters"][number];

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
  sortOptions: readonly SortOption[];
};

type Props<T extends string> = {
  activeFilters?: FilterChip[];
  children: React.ReactNode;
  className?: string;
  dispatch: React.Dispatch<FilterAndSortContainerAction<T>>;
  filters: React.ReactNode;
  headerLink?: { href: string; text: string };
  pendingFilteredCount: number;
  sideNav?: React.ReactNode;
  sortProps: SortProps<T>;
  state: FilterAndSortContainerState<T>;
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
  dispatch,
  filters,
  headerLink,
  pendingFilteredCount,
  sideNav,
  sortProps,
  state,
  totalCount,
}: Props<T>): React.JSX.Element {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  // displayedChips is snapshotted from activeFilters when the drawer opens.
  // This prevents newly-selected pending filters from appearing in Applied Filters until
  // "View Results" is clicked, avoiding layout shift. Chip removal mutates displayedChips
  // immediately so the chip disappears at once, but activeFilterValues (and thus the list)
  // only update when "View Results" is clicked.
  const [displayedChips, setDisplayedChips] = useState<FilterChip[]>([]);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const prevSortValueRef = useRef<T>(sortProps.currentSortValue);
  // Used to suppress the useEffect scroll when sort changes via the mobile drawer,
  // since the drawer's "View Results" handler scrolls explicitly.
  const suppressSortScrollRef = useRef(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const hasPendingFilters = selectHasPendingFilters(state);

  // Drive open/close imperatively from state
  useEffect(() => {
    if (filterDrawerVisible) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [filterDrawerVisible]);

  // Handle cancel (Escape) and close events on the dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (): void => {
      // Escape pressed: reset pending filter/sort changes before dialog closes
      dispatch(createResetFiltersAction());
      formRef.current?.reset();
      toggleButtonRef.current?.focus();
      // Do NOT preventDefault — let the browser close the dialog naturally
    };

    const handleClose = (): void => {
      // Sync React state for all close paths (Escape, X button, backdrop, View Results)
      setFilterDrawerVisible(false);
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("close", handleClose);
    return (): void => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("close", handleClose);
    };
  }, [dispatch]);

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

  const onFilterClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      if (filterDrawerVisible) {
        dispatch(createResetFiltersAction());
        formRef.current?.reset();
        dialogRef.current?.close();
        toggleButtonRef.current?.focus();
      } else {
        setFilterDrawerVisible(true);
        setDisplayedChips(activeFilters ?? []);
        dispatch(createResetFiltersAction());
        // Focus is handled natively by showModal()
      }
    },
    [activeFilters, filterDrawerVisible, dispatch],
  );

  return (
    <div
      className={`
        ${className || ""}
      `}
    >
      <div className={`group/list-with-filters mx-auto bg-subtle`}>
        <div
          className={`
            sticky top-0 z-nav-backdrop scroll-mt-0 border-b border-default
            bg-default text-xs
            tablet:col-span-full
          `}
        >
          <FilterAndSortToolbar
            dispatch={dispatch}
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

          <dialog
            aria-label="Filters"
            className={`
              fixed top-0 right-0 left-auto m-0 size-full max-h-full
              max-w-[380px] translate-x-full flex-col items-start gap-y-5
              overflow-y-auto border-0 bg-default p-0 text-left drop-shadow-2xl
              transition-[translate,overlay,display] transition-discrete
              duration-200 ease-in-out
              backdrop:bg-[#000]/40 backdrop:opacity-0
              backdrop:transition-opacity backdrop:transition-discrete
              backdrop:duration-200
              open:flex open:translate-x-0
              open:backdrop:opacity-100
              tablet:gap-y-10
              starting:open:translate-x-full
              starting:open:backdrop:opacity-0
            `}
            data-filter-drawer=""
            id="filters"
            onClick={(e) => {
              // Backdrop click: event.target is the dialog itself, not any child
              if (e.target === dialogRef.current) {
                dispatch(createResetFiltersAction());
                formRef.current?.reset();
                dialogRef.current?.close();
                toggleButtonRef.current?.focus();
              }
            }}
            ref={dialogRef}
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
                  dispatch(createResetFiltersAction());
                  formRef.current?.reset();
                  dialogRef.current?.close();
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
                  {displayedChips.length > 0 && (
                    <AppliedFiltersSection
                      filters={displayedChips}
                      onClearAll={() => {
                        setDisplayedChips([]);
                        dispatch(createClearFiltersAction());
                      }}
                      onRemove={(key, value) => {
                        setDisplayedChips((prev) =>
                          prev.filter((c) => c.key !== key),
                        );
                        dispatch(createRemoveAppliedFilterAction(key, value));
                      }}
                    />
                  )}
                  {/* Sort section in mobile drawer only (<640px).
                      Uncontrolled radios — value read from form on "View Results" click.
                      Desktop dropdown in header applies sort immediately. */}
                  <div className="tablet:hidden">
                    <AnimatedDetailsDisclosure
                      defaultOpen={true}
                      title="Sort by"
                    >
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
                    </AnimatedDetailsDisclosure>
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
                        dispatch(createClearFiltersAction());
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
                      dispatch(createSortAction(sortValue));
                      dispatch(createApplyFiltersAction());
                      dialogRef.current?.close();
                      listRef.current?.scrollIntoView();
                    }}
                    type="button"
                  >
                    View {pendingFilteredCount} Results
                  </button>
                </div>
              </div>
            </form>
          </dialog>
        </div>
      </div>
    </div>
  );
}
