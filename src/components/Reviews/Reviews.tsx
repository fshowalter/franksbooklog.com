import { type JSX, useReducer } from "react";

import type { BackdropImageProps } from "~/api/backdrops";
import type { CoverImageProps } from "~/api/covers";
import type { Review } from "~/api/reviews";

import { Abandoned } from "~/components/Abandoned";
import { Grade } from "~/components/Grade";
import { GroupedList } from "~/components/GroupedList";
import { ListItem } from "~/components/ListItem";
import { ListItemCover } from "~/components/ListItemCover";
import { ListItemKindAndYear } from "~/components/ListItemKindAndYear";
import { ListItemTitle } from "~/components/ListItemTitle";
import { ListWithFilters } from "~/components/ListWithFilters";
import { toSentenceArray } from "~/utils";

import type { Sort } from "./Reviews.reducer";

import { Filters } from "./Filters";
import { Actions, initState, reducer } from "./Reviews.reducer";

type InteractiveProps = {
  distinctKinds: readonly string[];
  distinctPublishedYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: Sort;
  values: ListItemValue[];
};

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
};

export type Props = InteractiveProps & {
  backdropImageProps: BackdropImageProps;
  deck: string;
};

type Author = Pick<Review["authors"][0], "name" | "sortName"> & {};

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
          sortValue={state.sortValue}
        />
      }
      list={
        <GroupedList
          className="bg-default"
          data-testid="list"
          groupedValues={state.groupedValues}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
          totalCount={state.filteredValues.length}
          visibleCount={state.showCount}
        >
          {(value) => <ReviewsListItem key={value.slug} value={value} />}
        </GroupedList>
      }
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
    <ListItem>
      <div
        className={`
          relative
          after:absolute after:top-0 after:left-0 after:z-10 after:size-full
          after:bg-default after:opacity-15 after:transition-opacity
          group-has-[a:hover]/list-item:after:opacity-0
        `}
      >
        <ListItemCover imageProps={value.coverImageProps} />
      </div>
      <div
        className={`
          flex grow flex-col items-start gap-y-2
          tablet:w-full tablet:pr-4
        `}
      >
        <ListItemTitle slug={value.slug} title={value.title} />
        <Authors
          className="font-sans text-xs leading-4 font-light text-subtle"
          values={value.authors}
        />
        <Grade className="mb-1" height={16} value={value.grade} />
        <Abandoned className="tablet:my-1" value={value.grade} />
        <ListItemKindAndYear kind={value.kind} year={value.yearPublished} />
      </div>
    </ListItem>
  );
}
