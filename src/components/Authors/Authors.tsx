import { useReducer, useState } from "react";

import type { Author } from "~/api/authors";
import type { AvatarImageProps } from "~/api/avatars";
import type { BackdropImageProps } from "~/api/backdrops";

import { AvatarListItem, GroupedAvatarList } from "~/components/AvatarList";
import { CollectionSortOptions } from "~/components/CollectionSortOptions";
import { ListWithFilters } from "~/components/ListWithFilters/ListWithFilters";

import type { Sort } from "./Authors.reducer";

import { Actions, initState, reducer } from "./Authors.reducer";
import { Filters } from "./Filters";

export type ListItemValue = Pick<Author, "name" | "slug" | "sortName"> & {
  avatarImageProps: AvatarImageProps | undefined;
  reviewCount: number;
};

export type Props = InteractiveProps & {
  backdropImageProps: BackdropImageProps;
  deck: string;
};

type InteractiveProps = {
  initialSort: Sort;
  values: ListItemValue[];
};

export function Authors({
  initialSort,
  values,
}: InteractiveProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    initState,
  );

  const [filterKey, setFilterKey] = useState(0);

  return (
    <ListWithFilters
      className={
        state.sortValue.startsWith("name-") ? `[--scroll-offset:52px]` : ""
      }
      dynamicSubNav={
        <AlphabetSubNav
          groupedValues={state.groupedValues}
          sortValue={state.sortValue}
        />
      }
      filters={
        <Filters
          dispatch={dispatch}
          filterValues={state.pendingFilterValues}
          key={filterKey}
        />
      }
      hasActiveFilters={state.hasActiveFilters}
      list={
        <GroupedAvatarList
          groupedValues={state.groupedValues}
          groupItemClassName={`scroll-mt-[calc(52px_+_var(--list-scroll-offset))]`}
        >
          {(value) => <AuthorListItem key={value.slug} value={value} />}
        </GroupedAvatarList>
      }
      onApplyFilters={() => dispatch({ type: Actions.APPLY_PENDING_FILTERS })}
      onClearFilters={() => {
        dispatch({ type: Actions.CLEAR_PENDING_FILTERS });
        setFilterKey((k) => k + 1);
      }}
      onFilterDrawerOpen={() =>
        dispatch({ type: Actions.RESET_PENDING_FILTERS })
      }
      onResetFilters={() => {
        dispatch({ type: Actions.RESET_PENDING_FILTERS });
        setFilterKey((k) => k + 1);
      }}
      pendingFilteredCount={state.pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sortValue,
        onSortChange: (e) =>
          dispatch({ type: Actions.SORT, value: e.target.value as Sort }),
        sortOptions: (
          <CollectionSortOptions options={["name", "review-count"]} />
        ),
      }}
      totalCount={state.filteredValues.length}
    />
  );
}

function AlphabetSubNav({
  groupedValues,
  sortValue,
}: {
  groupedValues: Map<string, ListItemValue[]>;
  sortValue: Sort;
}): false | React.JSX.Element {
  if (!sortValue.startsWith("name-")) {
    return false;
  }

  const letters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
  if (sortValue == "name-desc") {
    letters.reverse();
  }

  return (
    <nav className={`sticky top-0 z-nav-menu bg-[#333]`}>
      <ul
        className={`
          mx-auto flex scrollbar-hidden max-w-(--breakpoint-desktop) snap-x
          overflow-x-auto px-container text-md font-semibold tracking-wide
          laptop:justify-center
        `}
      >
        {letters.map((letter) => {
          return (
            <LetterLink
              key={letter}
              letter={letter}
              linkFunc={
                groupedValues.has(letter)
                  ? (letter: string): string => `#${letter}`
                  : undefined
              }
            />
          );
        })}
      </ul>
    </nav>
  );
}

function AuthorListItem({
  value,
}: {
  value: ListItemValue;
}): React.JSX.Element {
  return (
    <AvatarListItem avatarImageProps={value.avatarImageProps}>
      <div className="flex flex-col justify-center">
        <AuthorName name={value.name} slug={value.slug} />
        <div
          className={`
            mt-[6px] font-sans text-[13px] font-normal tracking-prose
            text-nowrap text-subtle
          `}
        >
          {value.reviewCount} {value.reviewCount > 1 ? "Reviews" : "Review"}
        </div>
      </div>
    </AvatarListItem>
  );
}

function AuthorName({
  name,
  slug,
}: {
  name: ListItemValue["name"];
  slug: string;
}): React.JSX.Element {
  return (
    <a
      className={`
        text-base leading-normal font-semibold text-default transition-all
        duration-500
        after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
        after:opacity-0
        hover:text-accent
      `}
      href={`/authors/${slug}/`}
    >
      <div className="leading-normal">{name}</div>
    </a>
  );
}

function LetterLink({
  letter,
  linkFunc,
}: {
  letter: string;
  linkFunc?: (letter: string) => string;
}): React.JSX.Element {
  return (
    <li
      className={`
        snap-start text-center font-sans
        ${linkFunc ? "text-inverse" : `text-grey`}
      `}
    >
      {linkFunc ? (
        <a
          className={`
            block transform-gpu p-4 transition-all
            hover:scale-105 hover:bg-canvas hover:text-default
          `}
          href={linkFunc(letter)}
        >
          {letter}
        </a>
      ) : (
        <div
          className={`
            p-4
            laptop:py-4
          `}
        >
          {letter}
        </div>
      )}
    </li>
  );
}
