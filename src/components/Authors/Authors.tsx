import { type JSX, useReducer, useState } from "react";

import type { Author } from "~/api/authors";
import type { AvatarImageProps } from "~/api/avatars";
import type { BackdropImageProps } from "~/api/backdrops";

import { AvatarListItem, GroupedAvatarList } from "~/components/AvatarList";
import { ListWithFilters } from "~/components/ListWithFilters";

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
}: InteractiveProps): JSX.Element {
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
          <>
            <option value="name-asc">Name (A &rarr; Z)</option>
            <option value="name-desc">Name (Z &rarr; A)</option>
            <option value="review-count-desc">Review Count (Most First)</option>
            <option value="review-count-asc">
              Review Count (Fewest First)
            </option>
          </>
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
}) {
  if (!sortValue.startsWith("name-")) {
    return;
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
                  ? (letter: string) => `#${letter}`
                  : undefined
              }
            />
          );
        })}
      </ul>
    </nav>
  );
}

function AuthorListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <AvatarListItem avatarImageProps={value.avatarImageProps}>
      <div className="flex flex-col justify-center">
        <AuthorName name={value.name} slug={value.slug} />
        <div
          className={`
            mt-[6px] font-sans text-xs font-light tracking-prose text-nowrap
            text-subtle
          `}
        >
          {value.reviewCount} Reviews
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
}) {
  return (
    <a
      className={`
        text-base leading-normal font-semibold text-accent
        after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
        after:opacity-0
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
}) {
  return (
    <li
      className={`
        snap-start text-center
        ${linkFunc ? "text-inverse" : `text-inverse-subtle`}
      `}
    >
      {linkFunc ? (
        <a
          className={`
            block transform-gpu p-4 transition-all
            hover:scale-105 hover:bg-accent hover:text-inverse
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
