import { graphql } from "gatsby";
import { useReducer } from "react";
import { ListWithFiltersLayout } from "../ListWithFiltersLayout";
import { Filters } from "./Filters";
import { Header } from "./Header";
import { List } from "./List";
import { Sort, initState, reducer } from "./Readings.reducer";

export function Readings({
  items,
  distinctEditions,
  distinctKinds,
  distinctReadingYears,
  distinctPublishedYears,
  workCount,
  initialSort,
}: {
  workCount: number;
  items: readonly Queries.ReadingsDataFragment[];
  distinctEditions: readonly string[];
  distinctPublishedYears: readonly string[];
  distinctKinds: readonly string[];
  distinctReadingYears: readonly string[];
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
      header={<Header workCount={workCount} />}
      filters={
        <Filters
          dispatch={dispatch}
          distinctEditions={distinctEditions}
          distinctPublishedYears={distinctPublishedYears}
          distinctKinds={distinctKinds}
          distinctReadingYears={distinctReadingYears}
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

export const query = graphql`
  fragment ReadingsData on ReadingProgressJson {
    ...ReadingsListItem
  }
`;
