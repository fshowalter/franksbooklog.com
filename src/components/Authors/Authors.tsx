import { useReducer } from "react";
import { ListWithFiltersLayout } from "../ListWithFiltersLayout";
import { Sort, initState, reducer } from "./Authors.reducer";
import { Filters } from "./Filters";
import { Header } from "./Header";
import { List } from "./List";

export function Authors({
  items,
  initialSort,
}: {
  items: readonly Queries.AuthorsListItemFragment[];
  initialSort: Sort;
}): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      items: [...items],
      sort: initialSort,
    },
    initState
  );

  return (
    <ListWithFiltersLayout
      header={<Header />}
      filters={<Filters dispatch={dispatch} sortValue={state.sortValue} />}
      list={
        <List
          groupedItems={state.groupedItems}
          totalCount={state.allItems.length}
          visibleCount={state.filteredItems.length}
          dispatch={dispatch}
        />
      }
    />
  );
}
