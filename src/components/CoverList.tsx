import type { CoverImageProps } from "~/api/covers";

import { GroupingListItem } from "./GroupingListItem/GroupingListItem";

export const CoverListItemImageConfig = {
  height: 375,
  sizes:
    "(min-width: 1800px) 216px, (min-width: 1380px) calc(13.25vw - 20px), (min-width: 1280px) calc(20vw - 70px), (min-width: 1060px) calc(20vw - 57px), (min-width: 800px) calc(25vw - 60px), (min-width: 680px) calc(33vw - 61px), calc(23.06vw + 4px)",
  width: 250,
};

type CoverListItemImageConfigType = {
  height: number;
  sizes: string;
  width: number;
};

export function CoverList({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <div className="@container/cover-list">
      {/* AIDEV-NOTE: The 250px values below cannot be extracted to a constant/variable
          because Tailwind's utility class system requires literal values at build time.
          Tailwind scans the codebase for class names and generates CSS only for the 
          classes it finds. Using dynamic values or variables would break this process
          and the styles wouldn't be generated. The repeated 250px represents the 
          minimum cover width for responsive breakpoints. */}
      <ol
        className={`
          items-baseline
          [--cover-list-item-width:50%]
          tablet:flex tablet:flex-wrap
          @min-[calc((250px_*_2)_+_1px)]/cover-list:[--cover-list-item-width:33.33%]
          @min-[calc((250px_*_3)_+_1px)]/cover-list:[--cover-list-item-width:25%]
          @min-[calc((250px_*_4)_+_1px)]/cover-list:[--cover-list-item-width:20%]
          @min-[calc((250px_*_5)_+_1px)]/cover-list:[--cover-list-item-width:16.66%]
          ${className}
        `}
      >
        {children}
      </ol>
    </div>
  );
}

export function CoverListItem({
  children,
  coverImageProps,
  hasReview = true,
}: {
  children: React.ReactNode;
  className?: string;
  coverImageProps: CoverImageProps;
  hasReview?: boolean;
}): React.JSX.Element {
  return (
    <li
      className={`
        group/list-item relative mb-1 flex w-full max-w-(--breakpoint-desktop)
        transform-gpu flex-row gap-x-[5%] bg-default px-container py-4
        transition-transform duration-500
        tablet:w-(--cover-list-item-width) tablet:flex-col tablet:bg-transparent
        tablet:px-6 tablet:py-6
        ${
          hasReview
            ? `
              tablet:has-[a:hover]:-translate-y-2
              tablet:has-[a:hover]:bg-default
              tablet:has-[a:hover]:drop-shadow-2xl
            `
            : `bg-transparent`
        }
      `}
    >
      <CoverListItemCover imageProps={coverImageProps} />
      {children}
    </li>
  );
}

export function GroupedCoverList<T>({
  children,
  groupedValues,
  groupItemClassName,
  onShowMore,
  totalCount,
  visibleCount,
  ...rest
}: {
  children: (item: T) => React.ReactNode;
  groupedValues: Map<string, Iterable<T>>;
  groupItemClassName?: string;
  onShowMore?: () => void;
  totalCount: number;
  visibleCount: number;
}): React.JSX.Element {
  return (
    <>
      <ol data-testid="grouped-cover-list" {...rest}>
        {[...groupedValues].map((groupedValue) => {
          const [group, groupValues] = groupedValue;
          return (
            <GroupingListItem
              className={groupItemClassName}
              groupText={group}
              key={group}
            >
              {" "}
              <div className="tablet:-mx-6">
                <CoverList>
                  {[...groupValues].map((value) => children(value))}
                </CoverList>
              </div>
            </GroupingListItem>
          );
        })}
      </ol>
      {onShowMore && (
        <div className="flex flex-col items-center px-container py-10">
          {totalCount > visibleCount && (
            <button
              className={`
                mx-auto w-full max-w-button bg-canvas py-5 text-center font-sans
                text-xs font-semibold tracking-wide uppercase shadow-all
                hover:bg-footer hover:text-inverse
              `}
              onClick={onShowMore}
              type="button"
            >
              Show More
            </button>
          )}
        </div>
      )}
    </>
  );
}

function CoverListItemCover({
  className,
  imageConfig = CoverListItemImageConfig,
  imageProps,
}: {
  className?: string;
  imageConfig?: CoverListItemImageConfigType;
  imageProps: CoverImageProps;
}): React.JSX.Element {
  return (
    <div
      className={`
        relative w-1/4 max-w-[250px] shrink-0 self-start overflow-hidden
        rounded-sm shadow-all transition-transform
        after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
        after:bg-default after:opacity-15 after:transition-opacity
        group-has-[a:hover]/list-item:after:opacity-0
        ${className ?? "tablet:w-auto"}
      `}
    >
      <div
        className={`
          relative
          after:absolute after:top-0 after:left-0 after:z-sticky after:block
          after:size-full after:rounded-[2.5px]
          after:bg-[url(/assets/spine-dark.png)] after:bg-size-[100%_100%]
          after:mix-blend-multiply
        `}
      >
        <div
          className={`
            relative z-10
            before:absolute before:top-0 before:left-0 before:z-10 before:block
            before:size-full before:rounded-[2.5px]
            before:bg-[url(/assets/spine-light.png)] before:bg-size-[100%_100%]
            after:absolute after:top-0 after:left-0 after:block after:size-full
            after:rounded-[2.5px] after:bg-[url(/assets/spot.png)]
            after:bg-size-[100%_100%] after:mix-blend-soft-light
          `}
        >
          <img
            {...imageProps}
            alt=""
            {...imageConfig}
            className={`
              transform-gpu rounded-[2.5px] bg-default shadow-sm
              transition-transform duration-500
              group-has-[a:hover]/list-item:scale-110
              @min-[160px]:shadow-lg
            `}
            decoding="async"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
