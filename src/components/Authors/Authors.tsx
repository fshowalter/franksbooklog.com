import { type JSX, useReducer } from "react";

import type { Author } from "~/api/authors";
import type { AvatarImageProps } from "~/api/avatars";
import type { BackdropImageProps } from "~/api/backdrops";

import { Backdrop } from "~/components/Backdrop";
import { GroupedList } from "~/components/GroupedList";
import { ListItem } from "~/components/ListItem";
import { ListItemAvatar } from "~/components/ListItemAvatar";
import { ListWithFiltersLayout } from "~/components/ListWithFiltersLayout";

import type { Sort } from "./Authors.reducer";

import { Actions, initState, reducer } from "./Authors.reducer";
import { Filters } from "./Filters";
export type ListItemValue = Pick<Author, "name" | "slug" | "sortName"> & {
  avatarImageProps: AvatarImageProps | undefined;
  reviewedWorkCount: number;
};

export type Props = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  initialSort: Sort;
  values: ListItemValue[];
};

export function Authors({
  backdropImageProps,
  deck,
  initialSort,
  values,
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    initState,
  );

  return (
    <ListWithFiltersLayout
      backdrop={
        <Backdrop deck={deck} imageProps={backdropImageProps} title="Authors" />
      }
      filters={<Filters dispatch={dispatch} sortValue={state.sortValue} />}
      list={
        <GroupedList
          data-testid="list"
          groupedValues={state.groupedValues}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
          totalCount={state.filteredValues.length}
          visibleCount={state.showCount}
        >
          {(value) => <AuthorListItem key={value.slug} value={value} />}
        </GroupedList>
      }
      totalCount={state.filteredValues.length}
    />
  );
}

function AuthorListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem
      className={`
        group/list-item relative transform-gpu transition-transform
        has-[a:hover]:z-30 has-[a:hover]:scale-105 has-[a:hover]:shadow-all
        has-[a:hover]:drop-shadow-2xl
      `}
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
