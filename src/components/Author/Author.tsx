import { useReducer } from "react";
import type { Author } from "src/api/authors";
import type { AvatarImageProps } from "src/api/avatars";
import { ListWithFiltersLayout } from "src/components/ListWithFiltersLayout";

import type { Sort } from "./Author.reducer";
import { initState, reducer } from "./Author.reducer";
import { Filters } from "./Filters";
import { Header } from "./Header";
import { List, type ListItemValue } from "./List";

export interface Props
  extends Pick<Author, "name" | "reviewedWorkCount" | "shelfWorkCount"> {
  works: ListItemValue[];
  distinctKinds: readonly string[];
  distinctPublishedYears: readonly string[];
  initialSort: Sort;
  avatarImageProps: AvatarImageProps | null;
}

export function Author({
  works,
  name,
  reviewedWorkCount,
  shelfWorkCount,
  distinctKinds,
  distinctPublishedYears,
  initialSort,
  avatarImageProps,
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      values: works,
      initialSort,
    },
    initState,
  );

  return (
    <ListWithFiltersLayout
      header={
        <Header
          name={name}
          reviewedWorkCount={reviewedWorkCount}
          shelfWorkCount={shelfWorkCount}
          avatarImageProps={avatarImageProps}
        />
      }
      filters={
        <Filters
          dispatch={dispatch}
          sortValue={state.sortValue}
          hideReviewed={state.hideReviewed}
          distinctKinds={distinctKinds}
          distinctPublishedYears={distinctPublishedYears}
        />
      }
      list={
        <List
          groupedValues={state.groupedValues}
          totalCount={state.filteredValues.length}
          visibleCount={state.showCount}
          dispatch={dispatch}
        />
      }
    />
  );
}
