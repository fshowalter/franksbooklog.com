import { type JSX, useReducer } from "react";

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

import type { Sort } from "./Reviews.reducer";

import { Filters } from "./Filters";
import { Actions, initState, reducer } from "./Reviews.reducer";

export type ListItemValue = Pick<
  Review,
  | "date"
  | "grade"
  | "gradeValue"
  | "kind"
  | "slug"
  | "sortTitle"
  | "title"
  | "yearPublished"
> & {
  authors: Author[];
  coverImageProps: CoverImageProps;
  displayDate: string;
};

export type Props = InteractiveProps & {
  backdropImageProps: BackdropImageProps;
  deck: string;
};

type Author = Pick<Review["authors"][0], "name" | "sortName"> & {};

type InteractiveProps = {
  distinctKinds: readonly string[];
  distinctPublishedYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: Sort;
  values: ListItemValue[];
};

export function Reviews({
  distinctKinds,
  distinctPublishedYears,
  distinctReviewYears,
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

  return (
    <ListWithFilters
      filters={
        <Filters
          dispatch={dispatch}
          distinctKinds={distinctKinds}
          distinctPublishedYears={distinctPublishedYears}
          distinctReviewYears={distinctReviewYears}
        />
      }
      list={
        <GroupedCoverList
          groupedValues={state.groupedValues}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
          totalCount={state.filteredValues.length}
          visibleCount={state.showCount}
        >
          {(value) => <ReviewsListItem key={value.slug} value={value} />}
        </GroupedCoverList>
      }
      sortProps={{
        currentSortValue: state.sortValue,
        onSortChange: (e) =>
          dispatch({ type: Actions.SORT, value: e.target.value as Sort }),
        sortOptions: (
          <>
            <option value="author-asc">Author (A &rarr; Z)</option>
            <option value="author-desc">Author (Z &rarr; A)</option>
            <option value="review-date-desc">Review Date (Newest First)</option>
            <option value="review-date-asc">Review Date (Oldest First)</option>
            <option value="year-published-desc">
              Work Year (Newest First)
            </option>
            <option value="year-published-asc">Work Year (Oldest First)</option>
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

function ReviewsListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <CoverListItem coverImageProps={value.coverImageProps}>
      <ListItemDetails>
        <ListItemTitle slug={value.slug} title={value.title} />
        <ListItemKindAndYear kind={value.kind} year={value.yearPublished} />
        <Authors
          className={`text-sm leading-4 font-normal tracking-prose text-muted`}
          values={value.authors}
        />
        <ListItemGrade grade={value.grade} />
        <Abandoned className="tablet:my-1" value={value.grade} />
        <ListItemReviewDate displayDate={value.displayDate} />
      </ListItemDetails>
    </CoverListItem>
  );
}
