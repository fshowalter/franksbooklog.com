import { WorkFilters } from "~/components/react/filter-and-sort/facet-groups/TitleFacets";
import { EditionFacet } from "~/components/react/filter-and-sort/facets/edition/EditionFacet";
import { ReviewedStatusFacet } from "~/components/react/filter-and-sort/facets/reviewed-status/ReviewedStatusFacet";
import { TitleFacet } from "~/components/react/filter-and-sort/facets/title/TitleFacet";
import { YearField } from "~/components/react/filter-and-sort/fields/YearField";

import type {
  ReadingLogAction,
  ReadingLogFiltersValues,
} from "./ReadingLog.reducer";

import {
  createKindFilterChangedAction,
  createReadingYearFilterChangedAction,
  createReviewedStatusFilterChangedAction,
  createTitleYearFilterChangedAction,
} from "./ReadingLog.reducer";

export function Filters({
  dispatch,
  distinctEditions,
  distinctKinds,
  distinctReadingYears,
  distinctTitleYears,
  editionCounts,
  filterValues,
  kindCounts,
  reviewedStatusCounts,
}: {
  dispatch: React.Dispatch<ReadingLogAction>;
  distinctEditions: readonly string[];
  distinctKinds: readonly string[];
  distinctReadingYears: readonly string[];
  distinctTitleYears: readonly string[];
  editionCounts?: Map<string, number>;
  filterValues: ReadingLogFiltersValues;
  kindCounts?: Map<string, number>;
  reviewedStatusCounts?: Map<string, number>;
}): React.JSX.Element {
  return (
    <>
      <TitleFacet defaultValue={filterValues.title} dispatch={dispatch} />

      <WorkFilters
        kind={{
          counts: kindCounts,
          defaultValues: filterValues.kind,
          onChange: (values) => dispatch(createKindFilterChangedAction(values)),
          onClear: () => dispatch(createKindFilterChangedAction([])),
          values: distinctKinds,
        }}
        workYear={{
          defaultValues: filterValues.workYear,
          onChange: (values) =>
            dispatch(
              createTitleYearFilterChangedAction(
                values,
                distinctTitleYears[0] ?? "",
                distinctTitleYears.at(-1) ?? "",
              ),
            ),
          values: distinctTitleYears,
        }}
      />
      <ReviewedStatusFacet
        counts={reviewedStatusCounts}
        defaultValues={filterValues.reviewedStatus}
        onChange={(values) =>
          dispatch(createReviewedStatusFilterChangedAction(values))
        }
        onClear={() => dispatch(createReviewedStatusFilterChangedAction([]))}
      />
      <YearField
        defaultValues={filterValues.readingYear}
        label="Reading Year"
        onYearChange={(values) =>
          dispatch(
            createReadingYearFilterChangedAction(
              values,
              distinctReadingYears[0] ?? "",
              distinctReadingYears.at(-1) ?? "",
            ),
          )
        }
        years={distinctReadingYears}
      />
      <EditionFacet
        defaultValues={filterValues.edition}
        dispatch={dispatch}
        distinctEditions={distinctEditions}
        editionCounts={editionCounts}
      />
    </>
  );
}
