import { EditionFacet } from "~/components/filter-and-sort/facets/edition/EditionFacet";
import { KindFacet } from "~/components/filter-and-sort/facets/kind/KindFacet";
import { ReadingYearFacet } from "~/components/filter-and-sort/facets/reading-year/ReadingYearFacet";
import { ReviewedStatusFacet } from "~/components/filter-and-sort/facets/reviewed-status/ReviewedStatusFacet";
import { TitleYearFacet } from "~/components/filter-and-sort/facets/title-year/TitleYearFacet";
import { TitleFacet } from "~/components/filter-and-sort/facets/title/TitleFacet";

import type {
  ReadingLogAction,
  ReadingLogFiltersValues,
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
      <TitleYearFacet
        defaultValues={filterValues.titleYear}
        dispatch={dispatch}
        distinctYears={distinctTitleYears}
      />
      <KindFacet
        defaultValues={filterValues.kind}
        dispatch={dispatch}
        distinctKinds={distinctKinds}
        kindCounts={kindCounts}
      />
      <ReviewedStatusFacet
        defaultValues={filterValues.reviewedStatus}
        dispatch={dispatch}
        statusCounts={reviewedStatusCounts}
      />
      <ReadingYearFacet
        defaultValues={filterValues.readingYear}
        dispatch={dispatch}
        distinctYears={distinctReadingYears}
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
