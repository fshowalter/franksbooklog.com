import { useReducer, useState } from "react";

import type { Author } from "~/api/authors";
import type { AvatarImageProps } from "~/api/avatars";
import type { BackdropImageProps } from "~/api/backdrops";
import type { CoverImageProps } from "~/api/covers";

import { Abandoned } from "~/components/Abandoned";
import { CoverListItem, GroupedCoverList } from "~/components/CoverList";
import { ListItemDetails } from "~/components/ListItemDetails";
import { ListItemGrade } from "~/components/ListItemGrade";
import { ListItemKindAndYear } from "~/components/ListItemKindAndYear";
import { ListItemReviewDate } from "~/components/ListItemReviewDate";
import { ListItemTitle } from "~/components/ListItemTitle";
import { ListWithFilters } from "~/components/ListWithFilters/ListWithFilters";
import { WorkSortOptions } from "~/components/WorkSortOptions";
import { toSentenceArray } from "~/utils/toSentenceArray";

import type { Sort } from "./Author.reducer";

import { Actions, initState, reducer } from "./Author.reducer";
import { Filters } from "./Filters";

export const AvatarImageConfig = {
  height: 250,
  width: 250,
};

export type ListItemValue = Pick<
  AuthorWork,
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
  coverImageProps: CoverImageProps;
  displayDate: string;
  otherAuthors: {
    name: string;
  }[];
  reviewDate: Date;
};

export type Props = InteractiveProps & {
  avatarImageProps: AvatarImageProps | undefined;
  backdropImageProps: BackdropImageProps;
  deck: string;
};

type AuthorWork = Author["reviewedWorks"][number];

type InteractiveProps = Pick<Author, "name"> & {
  distinctKinds: readonly string[];
  distinctReviewYears: readonly string[];
  distinctWorkYears: readonly string[];
  initialSort: Sort;
  values: ListItemValue[];
};

export function Author({
  distinctKinds,
  distinctReviewYears,
  distinctWorkYears,
  initialSort,
  values,
}: InteractiveProps): React.JSX.Element {
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
          visibleCount={state.showCount}
        >
          {(value) => <WorkListItem key={value.slug} value={value} />}
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
            value: e.target.value as Sort,
          }),
        sortOptions: (
          <WorkSortOptions
            options={["grade", "review-date", "title", "work-year"]}
          />
        ),
      }}
      totalCount={state.filteredValues.length}
    />
  );
}

function OtherAuthors({
  values,
}: {
  values: ListItemValue["otherAuthors"];
}): false | React.JSX.Element {
  if (values.length === 0) {
    return false;
  }

  return (
    <div className="font-serif text-[15px] leading-5">
      (with {toSentenceArray(values.map((value) => value.name))})
    </div>
  );
}

function WorkListItem({ value }: { value: ListItemValue }): React.JSX.Element {
  return (
    <CoverListItem coverImageProps={value.coverImageProps}>
      <ListItemDetails>
        <ListItemTitle slug={value.slug} title={value.title} />
        <OtherAuthors values={value.otherAuthors} />
        <ListItemKindAndYear kind={value.kind} year={value.workYear} />
        <ListItemGrade grade={value.grade} />
        <Abandoned value={value.grade} />
        <ListItemReviewDate displayDate={value.displayDate} />
      </ListItemDetails>
    </CoverListItem>
  );
}
