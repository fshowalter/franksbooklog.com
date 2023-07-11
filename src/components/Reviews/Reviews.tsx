import { useReducer } from "react";
import { ListWithFiltersLayout } from "../ListWithFiltersLayout";
import { Filters } from "./Filters";
import { Header } from "./Header";
import { List } from "./List";
import { Sort, initState, reducer } from "./Reviews.reducer";

export function Reviews({
  items,
  shortStoryCount,
  bookCount,
  distinctPublishedYears,
  distinctReviewYears,
  distinctKinds,
  abandonedCount,
  initialSort,
}: {
  items: readonly Queries.ReviewsListItemFragment[];
  shortStoryCount: number;
  bookCount: number;
  abandonedCount: number;
  distinctPublishedYears: readonly string[];
  distinctReviewYears: readonly string[];
  distinctKinds: readonly string[];
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
      header={
        <Header
          reviewCount={items.length}
          shortStoryCount={shortStoryCount}
          abandonedCount={abandonedCount}
          bookCount={bookCount}
        />
      }
      filters={
        <Filters
          dispatch={dispatch}
          sortValue={state.sortValue}
          distinctPublishedYears={distinctPublishedYears}
          distinctReviewYears={distinctReviewYears}
          distinctKinds={distinctKinds}
        />
      }
      list={
        <List
          dispatch={dispatch}
          groupedItems={state.groupedItems}
          visibleCount={state.showCount}
          totalCount={state.filteredItems.length}
        />
      }
    />
  );
}
