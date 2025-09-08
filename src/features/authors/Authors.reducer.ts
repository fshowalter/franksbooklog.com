import {
  type CollectionFiltersActionType,
  type CollectionFiltersState,
  type CollectionFiltersValues,
  createCollectionFiltersReducer,
  createInitialCollectionFiltersState,
  createSortActionCreator,
} from "~/components/FilterAndSort/CollectionFilters.reducer";

export {
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createSetNamePendingFilterAction,
} from "~/components/FilterAndSort/CollectionFilters.reducer";

import type { AuthorsValue } from "./Authors";
import type { AuthorsSort } from "./Authors.sorter";

export type AuthorsActionType = CollectionFiltersActionType<AuthorsSort>;

export type AuthorsFiltersValues = CollectionFiltersValues;

type AuthorsState = CollectionFiltersState<AuthorsValue, AuthorsSort>;

export function initState({
  initialSort,
  values,
}: {
  initialSort: AuthorsSort;
  values: AuthorsValue[];
}): AuthorsState {
  return createInitialCollectionFiltersState({
    initialSort,
    values,
  });
}

export const createSortAction = createSortActionCreator<AuthorsSort>();

export const authorsReducer = createCollectionFiltersReducer<
  AuthorsValue,
  AuthorsSort,
  AuthorsState
>();
