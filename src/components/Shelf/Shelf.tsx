import { useReducer } from "react";

import type { CoverImageProps } from "~/api/covers";
import type { ShelfWork } from "~/api/shelf";

import { SolidBackdrop } from "~/components/Backdrop";
import { GroupedList } from "~/components/GroupedList";
import { ListItem } from "~/components/ListItem";
import { ListItemCover } from "~/components/ListItemCover";
import { ListItemKindAndYear } from "~/components/ListItemKindAndYear";
import { ListItemTitle } from "~/components/ListItemTitle";
import { ListWithFiltersLayout } from "~/components/ListWithFiltersLayout";
import { toSentenceArray } from "~/utils";

import type { Sort } from "./Shelf.reducer";

import { Filters } from "./Filters";
import { initState, reducer } from "./Shelf.reducer";
import { Actions } from "./Shelf.reducer";

export type ListItemValue = Pick<
  ShelfWork,
  "kind" | "slug" | "sortTitle" | "title" | "yearPublished"
> & {
  authors: Author[];
  coverImageProps: CoverImageProps;
};

export type Props = {
  deck: string;
  distinctAuthors: readonly string[];
  distinctKinds: readonly string[];
  distinctPublishedYears: readonly string[];
  initialSort: Sort;
  values: ListItemValue[];
};

type Author = Pick<
  ShelfWork["authors"][number],
  "name" | "notes" | "sortName"
> & {};

export function Shelf({
  deck,
  distinctAuthors,
  distinctKinds,
  distinctPublishedYears,
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
      backdrop={<SolidBackdrop deck={deck} title="The Shelf" />}
      filters={
        <Filters
          dispatch={dispatch}
          distinctAuthors={distinctAuthors}
          distinctKinds={distinctKinds}
          distinctPublishedYears={distinctPublishedYears}
          sortValue={state.sortValue}
        />
      }
      list={
        <GroupedList
          data-testid="list"
          groupedValues={state.groupedValues}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
          totalCount={state.filteredValues.length}
          visibleCount={state.showCount}
        >
          {(value) => {
            return <ShelfListItem key={value.slug} value={value} />;
          }}
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
  values: ListItemValue["authors"];
}) {
  return (
    <div className={className}>
      {toSentenceArray(values.map((value) => value.name))}
    </div>
  );
}

function ShelfListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem background="bg-unreviewed">
      <ListItemCover imageProps={value.coverImageProps} />
      <div className="flex grow flex-col gap-y-1 tablet:w-full tablet:gap-y-2 desktop:pr-4">
        <ListItemTitle title={value.title} />
        <Authors
          className="font-sans text-xs leading-5 text-muted"
          values={value.authors}
        />
        <ListItemKindAndYear kind={value.kind} year={value.yearPublished} />
      </div>
    </ListItem>
  );
}
