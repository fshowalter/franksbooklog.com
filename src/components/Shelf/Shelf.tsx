import { useReducer } from "react";
import type { ShelfWork } from "src/api/shelf";
import { GroupedList } from "src/components/GroupedList";
import { ListItem } from "src/components/ListItem";
import { ListItemCover } from "src/components/ListItemCover";
import { ListItemTitle } from "src/components/ListItemTitle";
import { toSentenceArray } from "src/utils";

import { SolidBackdrop } from "../Backdrop";
import { ListItemKindAndYear } from "../ListItemKindAndYear";
import { ListWithFiltersLayout } from "../ListWithFiltersLayout";
import { Filters } from "./Filters";
import type { Sort } from "./Shelf.reducer";
import { initState, reducer } from "./Shelf.reducer";
import { Actions } from "./Shelf.reducer";

interface Author
  extends Pick<ShelfWork["authors"][number], "name" | "notes" | "sortName"> {}

export interface ListItemValue
  extends Pick<
    ShelfWork,
    "slug" | "title" | "yearPublished" | "sortTitle" | "kind"
  > {
  authors: Author[];
  coverImageProps: CoverImageProps;
}

export interface Props {
  values: ListItemValue[];
  distinctAuthors: readonly string[];
  distinctKinds: readonly string[];
  distinctPublishedYears: readonly string[];
  initialSort: Sort;
}

export function Shelf({
  values,
  distinctAuthors,
  distinctKinds,
  distinctPublishedYears,
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
          title="The Shelf"
          deck={`"Classic: A book which people praise and don’t read."`}
        />
      }
      totalCount={state.filteredValues.length}
      filters={
        <Filters
          sortValue={state.sortValue}
          dispatch={dispatch}
          distinctAuthors={distinctAuthors}
          distinctKinds={distinctKinds}
          distinctPublishedYears={distinctPublishedYears}
        />
      }
      list={
        <GroupedList
          groupedValues={state.groupedValues}
          visibleCount={state.showCount}
          totalCount={state.filteredValues.length}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
          data-testid="list"
        >
          {(value) => {
            return <ShelfListItem value={value} key={value.slug} />;
          }}
        </GroupedList>
      }
    />
  );
}

function ShelfListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem>
      <ListItemCover imageProps={value.coverImageProps} />
      <div className="flex grow flex-col gap-y-1 tablet:w-full tablet:gap-y-2 desktop:pr-4">
        <ListItemTitle title={value.title} />
        <Authors
          values={value.authors}
          className="font-sans text-xs leading-5 text-muted"
        />
        <ListItemKindAndYear year={value.yearPublished} kind={value.kind} />
      </div>
    </ListItem>
  );
}

function Authors({
  values,
  className,
}: {
  values: ListItemValue["authors"];
  className: string;
}) {
  return (
    <div className={className}>
      {toSentenceArray(values.map((value) => value.name))}
    </div>
  );
}
