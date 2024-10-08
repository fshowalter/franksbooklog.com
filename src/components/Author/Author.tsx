import { useReducer } from "react";
import type { Author } from "src/api/authors";
import type { AvatarImageProps } from "src/api/avatars";
import type { CoverImageProps } from "src/api/covers";
import { Grade } from "src/components/Grade";
import { GroupedList } from "src/components/GroupedList";
import { ListItem } from "src/components/ListItem";
import { ListItemCover } from "src/components/ListItemCover";
import { ListItemTitle } from "src/components/ListItemTitle";
import { ListWithFiltersLayout } from "src/components/ListWithFiltersLayout";
import { toSentenceArray } from "src/utils";

import { AvatarBackdrop } from "../Backdrop";
import { ListItemKindAndYear } from "../ListItemKindAndYear";
import type { Sort } from "./Author.reducer";
import { Actions, initState, reducer } from "./Author.reducer";
import { Filters } from "./Filters";

export interface Props extends Pick<Author, "name"> {
  works: ListItemValue[];
  distinctKinds: readonly string[];
  distinctPublishedYears: readonly string[];
  initialSort: Sort;
  avatarImageProps: AvatarImageProps | null;
  deck: string;
}

export const AvatarImageConfig = {
  width: 250,
  height: 250,
};

type AuthorWork = Author["works"][number];

export interface ListItemValue
  extends Pick<
    AuthorWork,
    | "title"
    | "yearPublished"
    | "kind"
    | "slug"
    | "sortTitle"
    | "grade"
    | "gradeValue"
    | "reviewed"
  > {
  coverImageProps: CoverImageProps;
  otherAuthors: {
    name: string;
  }[];
}

export function Author({
  works,
  name,
  deck,
  distinctKinds,
  distinctPublishedYears,
  initialSort,
  avatarImageProps,
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      values: works,
      initialSort,
    },
    initState,
  );

  return (
    <ListWithFiltersLayout
      data-pagefind-body
      backdrop={
        <AvatarBackdrop
          avatarImageProps={avatarImageProps}
          breadcrumb={
            <a
              className="underline decoration-2 underline-offset-8 hover:text-accent"
              href="/authors/"
            >
              Authors
            </a>
          }
          name={name}
          deck={deck}
        />
      }
      totalCount={state.filteredValues.length}
      filters={
        <Filters
          dispatch={dispatch}
          distinctKinds={distinctKinds}
          distinctPublishedYears={distinctPublishedYears}
          sortValue={state.sortValue}
          hideReviewed={state.hideReviewed}
        />
      }
      list={
        <GroupedList
          data-testid="list"
          groupedValues={state.groupedValues}
          visibleCount={state.showCount}
          totalCount={state.filteredValues.length}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
        >
          {(value) => {
            return <WorkListItem value={value} key={value.slug} />;
          }}
        </GroupedList>
      }
    />
  );
}

function WorkListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem>
      <ListItemCover imageProps={value.coverImageProps} />
      <div className="flex grow flex-col items-start gap-y-1 tablet:w-full tablet:gap-y-2 desktop:pr-4">
        <ListItemTitle
          title={value.title}
          slug={value.reviewed ? value.slug : null}
        />
        <OtherAuthors values={value.otherAuthors} />
        <ListItemKindAndYear year={value.yearPublished} kind={value.kind} />
        <Grade value={value.grade} height={16} />
      </div>
    </ListItem>
  );
}

function OtherAuthors({ values }: { values: ListItemValue["otherAuthors"] }) {
  if (values.length === 0) {
    return null;
  }

  return (
    <div className="font-sans text-xs leading-5 text-subtle">
      (with {toSentenceArray(values.map((value) => value.name))})
    </div>
  );
}
