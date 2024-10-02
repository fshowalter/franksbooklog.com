import { useReducer } from "react";
import type { CoverImageProps } from "src/api/covers";
import type { Review } from "src/api/reviews";
import { ListItem } from "src/components/ListItem";
import { ListItemCover } from "src/components/ListItemCover";
import { ListItemKindAndYear } from "src/components/ListItemKindAndYear";
import { ListItemTitle } from "src/components/ListItemTitle";
import { ListWithFiltersLayout } from "src/components/ListWithFiltersLayout";
import { toSentenceArray } from "src/utils";

import { SolidBackdrop } from "../Backdrop";
import { Grade } from "../Grade";
import { GroupedList } from "../GroupedList";
import { Filters } from "./Filters";
import type { Sort } from "./Reviews.reducer";
import { Actions, initState, reducer } from "./Reviews.reducer";

export interface Props {
  values: ListItemValue[];
  distinctPublishedYears: readonly string[];
  distinctReviewYears: readonly string[];
  distinctKinds: readonly string[];
  initialSort: Sort;
}

interface Author extends Pick<Review["authors"][0], "name" | "sortName"> {}

export interface ListItemValue
  extends Pick<
    Review,
    | "grade"
    | "slug"
    | "date"
    | "gradeValue"
    | "title"
    | "yearPublished"
    | "sortTitle"
    | "kind"
  > {
  authors: Author[];
  coverImageProps: CoverImageProps;
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
      backdrop={
        <SolidBackdrop
          title="Reviews"
          deck={`"I intend to put up with nothing that I can put down."`}
        />
      }
      totalCount={state.filteredValues.length}
      filters={
        <Filters
          dispatch={dispatch}
          sortValue={state.sortValue}
          distinctKinds={distinctKinds}
          distinctPublishedYears={distinctPublishedYears}
          distinctReviewYears={distinctReviewYears}
        />
      }
      list={
        <GroupedList
          data-testid="list"
          groupedValues={state.groupedValues}
          visibleCount={state.showCount}
          totalCount={state.filteredValues.length}
          className="bg-default"
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
        >
          {(value) => <ReviewsListItem value={value} key={value.slug} />}
        </GroupedList>
      }
    />
  );
}

function ReviewsListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem>
      <ListItemCover imageProps={value.coverImageProps} />
      <div className="flex grow flex-col items-start gap-y-1 tablet:w-full tablet:gap-y-2 desktop:pr-4">
        <ListItemTitle title={value.title} slug={value.slug} />
        <Authors
          values={value.authors}
          className="font-sans text-xs leading-5 text-muted"
        />
        <ListItemKindAndYear year={value.yearPublished} kind={value.kind} />
        <Grade value={value.grade} height={16} />
      </div>
    </ListItem>
  );
}

function Authors({
  values,
  className,
}: {
  values: Author[];
  className: string;
}) {
  return (
    <div className={className}>
      {toSentenceArray(values.map((value) => value.name))}
    </div>
  );
}
