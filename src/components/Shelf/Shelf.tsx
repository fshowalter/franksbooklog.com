import { graphql } from "gatsby";
import { useReducer } from "react";
import { ListWithFiltersLayout } from "../ListWithFiltersLayout";
import { Filters } from "./Filters";
import { Header } from "./Header";
import { List } from "./List";
import { Sort, initState, reducer } from "./Shelf.reducer";

export function Shelf({
  items,
  distinctAuthors,
  distinctKinds,
  distinctPublishedYears,
  initialSort,
}: {
  items: readonly Queries.ShelfDataFragment[];
  distinctAuthors: readonly string[];
  distinctKinds: readonly string[];
  distinctPublishedYears: readonly string[];
  initialSort: Sort;
}): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      items: [...items],
      sort: initialSort,
    },
    initState,
  );

  return (
    <ListWithFiltersLayout
      header={<Header shelfCount={items.length} />}
      filters={
        <Filters
          dispatch={dispatch}
          distinctAuthors={distinctAuthors}
          distinctKinds={distinctKinds}
          distinctPublishedYears={distinctPublishedYears}
          sortValue={state.sortValue}
        />
      }
      list={
        <List
          dispatch={dispatch}
          groupedItems={state.groupedItems}
          totalCount={state.filteredItems.length}
          visibleCount={state.showCount}
        />
      }
    />
  );
}

export const pageQuery = graphql`
  fragment ShelfData on WorksJson {
    ...ShelfListItem
  }
`;
