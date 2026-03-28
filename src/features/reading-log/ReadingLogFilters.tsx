import { EditionFacet } from "~/components/filter-and-sort/facets/edition/EditionFacet";
import { KindFacet } from "~/components/filter-and-sort/facets/kind/KindFacet";
import { ReadingYearFacet } from "~/components/filter-and-sort/facets/reading-year/ReadingYearFacet";
import { ReviewedStatusFacet } from "~/components/filter-and-sort/facets/reviewed-status/ReviewedStatusFacet";
import { TitleYearFacet } from "~/components/filter-and-sort/facets/title-year/TitleYearFacet";
import { TitleFacet } from "~/components/filter-and-sort/facets/title/TitleFacet";

import type { ReadingLogValue } from "./ReadingLog";
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
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<ReadingLogAction>;
  distinctEditions: readonly string[];
  distinctKinds: readonly string[];
  distinctReadingYears: readonly string[];
  distinctTitleYears: readonly string[];
  filterValues: ReadingLogFiltersValues;
  values: readonly ReadingLogValue[];
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
        values={values}
      />
      <ReviewedStatusFacet
        defaultValues={filterValues.reviewedStatus}
        dispatch={dispatch}
        values={values}
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
        values={values}
      />
    </>
  );
}
