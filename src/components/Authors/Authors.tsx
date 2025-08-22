import { type JSX, useReducer, useState } from "react";

import type { Author } from "~/api/authors";
import type { AvatarImageProps } from "~/api/avatars";
import type { BackdropImageProps } from "~/api/backdrops";

import { GroupedList } from "~/components/GroupedList";
import { ListItem } from "~/components/ListItem";
import { ListItemAvatar } from "~/components/ListItemAvatar";
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
        <GroupedList
          data-testid="list"
          groupedValues={state.groupedValues}
          groupItemClassName={`scroll-mt-[calc(52px_+_var(--list-scroll-offset))]`}
          totalCount={state.filteredValues.length}
          visibleCount={state.filteredValues.length}
        >
          {(value) => <AuthorListItem key={value.slug} value={value} />}
        </GroupedList>
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
    <nav className={`sticky top-0 z-[21] bg-footer`}>
      <ul
        className={`
          mx-auto flex scrollbar-hidden max-w-(--breakpoint-desktop) snap-x
          overflow-x-auto px-container font-sans text-sm font-normal
          tracking-wide
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
    <ListItem
      className="relative"
      extraVerticalPadding={true}
      itemsCenter={true}
    >
      <div
        className={`
          relative rounded-full
          after:absolute after:top-0 after:left-0 after:size-full
          after:bg-default after:opacity-15 after:transition-opacity
          group-has-[a:hover]/list-item:after:opacity-0
        `}
      >
        <ListItemAvatar imageProps={value.avatarImageProps} />
      </div>
      <AuthorName slug={value.slug} value={value.name} />
      <div className={`ml-auto font-sans text-sm text-nowrap text-subtle`}>
        {value.reviewedWorkCount}
      </div>
    </ListItem>
  );
}

function AuthorName({
  slug,
  value,
}: {
  slug?: string;
  value: ListItemValue["name"];
}) {
  if (!slug) {
    return (
      <span className="font-sans text-sm leading-normal font-light text-subtle">
        {value}
      </span>
    );
  }

  return (
    <a
      className={`
        font-sans text-sm leading-normal font-medium text-accent
        after:absolute after:top-0 after:left-0 after:size-full after:opacity-0
        hover:text-accent
      `}
      href={`/authors/${slug}/`}
    >
      {value}
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
