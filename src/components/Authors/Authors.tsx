import { useReducer } from "react";
import type { Author } from "src/api/authors";
import type { AvatarImageProps } from "src/api/avatars";
import { GroupedList } from "src/components/GroupedList";
import { ListItem } from "src/components/ListItem";
import { ListItemAvatar } from "src/components/ListItemAvatar";
import { ListWithFiltersLayout } from "src/components/ListWithFiltersLayout";

import { SolidBackdrop } from "../Backdrop";
import type { Sort } from "./Authors.reducer";
import { Actions, initState, reducer } from "./Authors.reducer";
import { Filters } from "./Filters";
export interface ListItemValue
  extends Pick<
    Author,
    "name" | "slug" | "sortName" | "reviewedWorkCount" | "workCount"
  > {
  avatarImageProps: AvatarImageProps | null;
}

export interface Props {
  values: ListItemValue[];
  initialSort: Sort;
  deck: string;
}

export function Authors({ values, initialSort, deck }: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      values,
      initialSort,
    },
    initState,
  );

  return (
    <ListWithFiltersLayout
      backdrop={<SolidBackdrop title="Authors" deck={deck} />}
      totalCount={state.filteredValues.length}
      filters={<Filters dispatch={dispatch} sortValue={state.sortValue} />}
      list={
        <GroupedList
          data-testid="list"
          groupedValues={state.groupedValues}
          visibleCount={state.showCount}
          totalCount={state.filteredValues.length}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
        >
          {(value) => <AuthorListItem value={value} key={value.slug} />}
        </GroupedList>
      }
    />
  );
}

function AuthorListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem itemsCenter={true} extraVerticalPadding={true}>
      <ListItemAvatar imageProps={value.avatarImageProps} />
      <AuthorName
        value={value.name}
        slug={value.reviewedWorkCount > 0 ? value.slug : null}
      />
      <div className="ml-auto text-nowrap font-sans text-xs text-subtle">
        {value.reviewedWorkCount}&thinsp;/&thinsp;{value.workCount}
      </div>
    </ListItem>
  );
}

function AuthorName({
  value,
  slug,
}: {
  value: ListItemValue["name"];
  slug: string | null;
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
      href={`/authors/${slug}/`}
      className="font-sans text-sm font-medium leading-normal text-accent decoration-accent decoration-2 underline-offset-4 before:absolute before:left-[var(--container-padding)] before:top-4 before:aspect-square before:w-16 hover:underline tablet:before:left-4 tablet:before:top-6 tablet:before:w-20 desktop:before:left-6"
    >
      {value}
    </a>
  );
}
