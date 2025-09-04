import type { WorkFilterValues } from "~/components/ListWithFilters/worksReducerUtils";

import { WorkFilters } from "~/components/ListWithFilters/WorkFilters";

import type { ActionType } from "./Author.reducer";

import { Actions } from "./Author.reducer";

export function Filters({
  dispatch,
  distinctKinds,
  distinctReviewYears,
  distinctWorkYears,
  filterValues,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctKinds: readonly string[];
  distinctReviewYears: readonly string[];
  distinctWorkYears: readonly string[];
  filterValues: WorkFilterValues;
}): React.JSX.Element {
  return (
    <WorkFilters
      grade={{
        initialValue: filterValues.grade,
        onChange: (values) =>
          dispatch({ type: Actions.PENDING_FILTER_GRADE, values }),
      }}
      kind={{
        initialValue: filterValues.kind,
        onChange: (value) =>
          dispatch({ type: Actions.PENDING_FILTER_KIND, value }),
        values: distinctKinds,
      }}
      reviewYear={{
        initialValue: filterValues.reviewYear,
        onChange: (values) =>
          dispatch({ type: Actions.PENDING_FILTER_REVIEW_YEAR, values }),
        values: distinctReviewYears,
      }}
      title={{
        initialValue: filterValues.title,
        onChange: (value) =>
          dispatch({ type: Actions.PENDING_FILTER_TITLE, value }),
      }}
      workYear={{
        initialValue: filterValues.workYear,
        onChange: (values) =>
          dispatch({ type: Actions.PENDING_FILTER_WORK_YEAR, values }),

        values: distinctWorkYears,
      }}
    />
  );
}
