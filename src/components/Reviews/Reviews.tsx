import { useReducer } from "react";
import { ListWithFiltersLayout } from "src/components/ListWithFiltersLayout";

import { Filters } from "./Filters";
import { Header } from "./Header";
import type { ListItemValue } from "./List";
import { List } from "./List";
import type { Sort } from "./Reviews.reducer";
import { initState, reducer } from "./Reviews.reducer";

export interface Props {
  values: ListItemValue[];
  distinctPublishedYears: readonly string[];
  distinctReviewYears: readonly string[];
  distinctKinds: readonly string[];
  initialSort: Sort;
}

export function Reviews({
  values,
  distinctPublishedYears,
  distinctReviewYears,
  distinctKinds,
  initialSort,
}: Props): JSX.Element {
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
      header={<Header reviewCount={values.length} />}
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
          groupedValues={state.groupedValues}
          visibleCount={state.showCount}
          totalCount={state.filteredValues.length}
        />
      }
    />
  );
}
