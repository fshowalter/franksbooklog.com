import { useReducer } from "react";

import type { CoverImageProps } from "~/api/covers";
import type { Review } from "~/api/reviews";

import { SolidBackdrop } from "~/components/Backdrop";
import { Grade } from "~/components/Grade";
import { GroupedList } from "~/components/GroupedList";
import { ListItem } from "~/components/ListItem";
import { ListItemCover } from "~/components/ListItemCover";
import { ListItemKindAndYear } from "~/components/ListItemKindAndYear";
import { ListItemTitle } from "~/components/ListItemTitle";
import { ListWithFiltersLayout } from "~/components/ListWithFiltersLayout";
import { toSentenceArray } from "~/utils";

import type { Sort } from "./Reviews.reducer";

import { Filters } from "./Filters";
import { Actions, initState, reducer } from "./Reviews.reducer";

export type Props = {
  deck: string;
  distinctKinds: readonly string[];
  distinctPublishedYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: Sort;
  values: ListItemValue[];
};

type Author = {} & Pick<Review["authors"][0], "name" | "sortName">;

export type ListItemValue = {
  authors: Author[];
  coverImageProps: CoverImageProps;
} & Pick<
  Review,
  | "date"
  | "grade"
  | "gradeValue"
  | "kind"
  | "slug"
  | "sortTitle"
  | "title"
  | "yearPublished"
>;

export function Reviews({
  deck,
  distinctKinds,
  distinctPublishedYears,
  distinctReviewYears,
  initialSort,
  values,
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    initState,
  );

  return (
    <ListWithFiltersLayout
      backdrop={<SolidBackdrop deck={deck} title="Reviews" />}
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

function ReviewsListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem>
      <ListItemCover imageProps={value.coverImageProps} />
      <div className="flex grow flex-col items-start gap-y-1 tablet:w-full tablet:gap-y-2 desktop:pr-4">
        <ListItemTitle slug={value.slug} title={value.title} />
        <Authors
          className="font-sans text-xs leading-5 text-muted"
          values={value.authors}
        />
        <ListItemKindAndYear kind={value.kind} year={value.yearPublished} />
        <Grade height={16} value={value.grade} />
        <Abandoned value={value.grade} />
      </div>
    </ListItem>
  );
}

function Abandoned({ value }: { value: string }) {
  if (value !== "Abandoned") {
    return null;
  }

  return (
    <div className="bg-abandoned p-1 font-sans text-xxs font-semibold uppercase text-[#fff]">
      Abandoned
    </div>
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
      {toSentenceArray(values.map((value) => value.name))}
    </div>
  );
}
