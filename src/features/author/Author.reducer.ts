import type { AuthorValue } from "./Author";

export {
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createSetGradePendingFilterAction,
  createSetKindPendingFilterAction,
  createSetReviewYearPendingFilterAction,
  createSetTitlePendingFilterAction,
  createSetWorkYearPendingFilterAction,
  createShowMoreAction,
} from "~/components/FilterAndSort/ReviewedWorkFilters.reducer";

import {
  createInitialReviewedWorkFiltersState,
  createReviewedWorkFiltersReducer,
  createSortActionCreator,
  type ReviewedWorkFiltersActionType,
  type ReviewedWorkFiltersState,
} from "~/components/FilterAndSort/ReviewedWorkFilters.reducer";

import type { AuthorSort } from "./Author.sorter";

export type AuthorActionType = ReviewedWorkFiltersActionType<AuthorSort>;

type AuthorState = ReviewedWorkFiltersState<AuthorValue, AuthorSort>;

export function initState({
  initialSort,
  values,
}: {
  initialSort: AuthorSort;
  values: AuthorValue[];
}): AuthorState {
  return createInitialReviewedWorkFiltersState({ initialSort, values });
}

// Create reducer function
export const authorReducer = createReviewedWorkFiltersReducer<
  AuthorValue,
  AuthorSort,
  AuthorState
>();

export const createSortAction = createSortActionCreator<AuthorSort>();
