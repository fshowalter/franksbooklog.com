import type { SortProps } from "./FilterAndSortContainer";

export function FilterAndSortHeader<T extends string>({
  filterDrawerVisible,
  headerLinks: listHeaderButtons,
  onFilterClick,
  sortProps,
  toggleButtonRef,
  totalCount,
}: {
  filterDrawerVisible: boolean;
  headerLinks?: React.ReactNode;
  onFilterClick: (event: React.MouseEvent) => void;
  sortProps: SortProps<T>;
  toggleButtonRef: React.RefObject<HTMLButtonElement | null>;
  totalCount: number;
}): React.JSX.Element {
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
        <span className={`text-sm font-bold text-default`}>
          {totalCount.toLocaleString()}
        </span>
        <span className="text-xs leading-none font-normal tracking-wide">
          {" "}
          Results
        </span>
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
            flex items-baseline gap-x-4 text-xs font-bold tracking-wide
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
          text-xs font-bold text-nowrap text-muted uppercase shadow-all
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
