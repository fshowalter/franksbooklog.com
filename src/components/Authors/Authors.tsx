import { useReducer } from "react";

import type { Author } from "~/api/authors";
import type { AvatarImageProps } from "~/api/avatars";

import { SolidBackdrop } from "~/components/Backdrop";
import { GroupedList } from "~/components/GroupedList";
import { ListItem } from "~/components/ListItem";
import { ListItemAvatar } from "~/components/ListItemAvatar";
import { ListWithFiltersLayout } from "~/components/ListWithFiltersLayout";

import type { Sort } from "./Authors.reducer";

import { Actions, initState, reducer } from "./Authors.reducer";
import { Filters } from "./Filters";
export type ListItemValue = {
  avatarImageProps: AvatarImageProps | undefined;
} & Pick<
  Author,
  "name" | "reviewedWorkCount" | "slug" | "sortName" | "workCount"
>;

export type Props = {
  deck: string;
  initialSort: Sort;
  values: ListItemValue[];
};

export function Authors({ deck, initialSort, values }: Props): JSX.Element {
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
      backdrop={<SolidBackdrop deck={deck} title="Authors" />}
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
    <ListItem extraVerticalPadding={true} itemsCenter={true}>
      <ListItemAvatar imageProps={value.avatarImageProps} />
      <AuthorName
        slug={value.reviewedWorkCount > 0 ? value.slug : undefined}
        value={value.name}
      />
      <div className="ml-auto text-nowrap font-sans text-xs text-subtle">
        {value.reviewedWorkCount}&thinsp;/&thinsp;{value.workCount}
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
      <span className="font-sans text-sm font-light leading-normal text-subtle">
        {value}
      </span>
    );
  }

  return (
    <a
      className="font-sans text-sm font-medium leading-normal text-accent decoration-accent decoration-2 underline-offset-4 before:absolute before:left-[var(--container-padding)] before:top-4 before:aspect-square before:w-16 hover:underline tablet:before:left-4 tablet:before:top-6 tablet:before:w-20 desktop:before:left-6"
      href={`/authors/${slug}/`}
    >
      {value}
    </a>
  );
}
