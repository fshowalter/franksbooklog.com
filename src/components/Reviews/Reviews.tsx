import { type JSX, useReducer, useState } from "react";

import type { BackdropImageProps } from "~/api/backdrops";
import type { CoverImageProps } from "~/api/covers";
import type { Review } from "~/api/reviews";

import { Abandoned } from "~/components/Abandoned";
import { CoverListItem, GroupedCoverList } from "~/components/CoverList";
import { ListItemDetails } from "~/components/ListItemDetails";
import { ListItemGrade } from "~/components/ListItemGrade";
import { ListItemKindAndYear } from "~/components/ListItemKindAndYear";
import { ListItemReviewDate } from "~/components/ListItemReviewDate";
import { ListItemTitle } from "~/components/ListItemTitle";
import { ListWithFilters } from "~/components/ListWithFilters";
import { toSentenceArray } from "~/utils";

import type { ReviewsSort } from "./Reviews.reducer";

import { Filters } from "./Filters";
import { Actions, initState, reducer } from "./Reviews.reducer";

export type Props = InteractiveProps & {
  backdropImageProps: BackdropImageProps;
  deck: string;
};

export type ReviewsListItemValue = Pick<
  Review,
  | "authorSequence"
  | "date"
  | "grade"
  | "gradeValue"
  | "kind"
  | "reviewSequence"
  | "reviewYear"
  | "slug"
  | "sortTitle"
  | "title"
  | "workYear"
  | "workYearSequence"
> & {
  authors: Author[];
  coverImageProps: CoverImageProps;
  displayDate: string;
};

type Author = Pick<Review["authors"][number], "name" | "sortName"> & {};

type InteractiveProps = {
  distinctKinds: readonly string[];
  distinctReviewYears: readonly string[];
  distinctWorkYears: readonly string[];
  initialSort: ReviewsSort;
  values: ReviewsListItemValue[];
};

export function Reviews({
  distinctKinds,
  distinctReviewYears,
  distinctWorkYears,
  initialSort,
  values,
}: InteractiveProps): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    initState,
  );
  const [filterKey, setFilterKey] = useState(0);

  return (
    <ListWithFilters
      filters={
        <Filters
          dispatch={dispatch}
          distinctKinds={distinctKinds}
          distinctReviewYears={distinctReviewYears}
          distinctWorkYears={distinctWorkYears}
          filterValues={state.pendingFilterValues}
          key={filterKey}
        />
      }
      hasActiveFilters={state.hasActiveFilters}
      list={
        <GroupedCoverList
          groupedValues={state.groupedValues}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
          totalCount={state.filteredValues.length}
          visibleCount={state.showCount!}
        >
          {(value) => <ReviewsListItem key={value.slug} value={value} />}
        </GroupedCoverList>
      }
      onApplyFilters={() => dispatch({ type: Actions.APPLY_PENDING_FILTERS })}
      onClearFilters={() => {
        dispatch({ type: Actions.CLEAR_PENDING_FILTERS });
        setFilterKey((k) => k + 1);
      }}
      onFilterDrawerOpen={() =>
        dispatch({ type: Actions.RESET_PENDING_FILTERS })
      }
      onResetFilters={() => {
        dispatch({ type: Actions.RESET_PENDING_FILTERS });
        setFilterKey((k) => k + 1);
      }}
      pendingFilteredCount={state.pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sortValue,
        onSortChange: (e) =>
          dispatch({
            type: Actions.SORT,
            value: e.target.value as ReviewsSort,
          }),
        sortOptions: (
          <>
            <option value="author-asc">Author (A &rarr; Z)</option>
            <option value="author-desc">Author (Z &rarr; A)</option>
            <option value="review-date-desc">Review Date (Newest First)</option>
            <option value="review-date-asc">Review Date (Oldest First)</option>
            <option value="work-year-desc">Work Year (Newest First)</option>
            <option value="work-year-asc">Work Year (Oldest First)</option>
            <option value="title-asc">Title (A &rarr; Z)</option>
            <option value="title-desc">Title (Z &rarr; A)</option>
            <option value="grade-desc">Grade (Best First)</option>
            <option value="grade-asc">Grade (Worst First)</option>
          </>
        ),
      }}
      totalCount={state.filteredValues.length}
    />
  );
}

function Authors({
  className,
  values,
}: {
  className: string;
  values: Author[];
}) {
  return (
    <div className={className}>
      {toSentenceArray(
        values.map((value) => (
          <span className="font-normal text-muted" key={value.name}>
            {value.name}
          </span>
        )),
      )}
    </div>
  );
}

function ReviewsListItem({
  value,
}: {
  value: ReviewsListItemValue;
}): JSX.Element {
  return (
    <CoverListItem coverImageProps={value.coverImageProps}>
      <ListItemDetails>
        <ListItemTitle slug={value.slug} title={value.title} />
        <Authors
          className={`text-sm leading-4 font-normal tracking-prose text-muted`}
          values={value.authors}
        />
        <ListItemKindAndYear kind={value.kind} year={value.workYear} />
        <ListItemGrade grade={value.grade} />
        <Abandoned className="tablet:my-1" value={value.grade} />
        <ListItemReviewDate displayDate={value.displayDate} />
      </ListItemDetails>
    </CoverListItem>
  );
}
