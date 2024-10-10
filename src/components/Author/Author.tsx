import { useReducer } from "react";

import type { Author } from "~/api/authors";
import type { AvatarImageProps } from "~/api/avatars";
import type { CoverImageProps } from "~/api/covers";

import { AvatarBackdrop } from "~/components/Backdrop";
import { Grade } from "~/components/Grade";
import { GroupedList } from "~/components/GroupedList";
import { ListItem } from "~/components/ListItem";
import { ListItemCover } from "~/components/ListItemCover";
import { ListItemKindAndYear } from "~/components/ListItemKindAndYear";
import { ListItemTitle } from "~/components/ListItemTitle";
import { ListWithFiltersLayout } from "~/components/ListWithFiltersLayout";
import { toSentenceArray } from "~/utils";

import type { Sort } from "./Author.reducer";

import { Actions, initState, reducer } from "./Author.reducer";
import { Filters } from "./Filters";

export type Props = {
  avatarImageProps: AvatarImageProps | null;
  deck: string;
  distinctKinds: readonly string[];
  distinctPublishedYears: readonly string[];
  initialSort: Sort;
  works: ListItemValue[];
} & Pick<Author, "name">;

export const AvatarImageConfig = {
  height: 250,
  width: 250,
};

type AuthorWork = Author["works"][number];

export type ListItemValue = {
  coverImageProps: CoverImageProps;
  otherAuthors: {
    name: string;
  }[];
} & Pick<
  AuthorWork,
  | "grade"
  | "gradeValue"
  | "kind"
  | "reviewed"
  | "slug"
  | "sortTitle"
  | "title"
  | "yearPublished"
>;

export function Author({
  avatarImageProps,
  deck,
  distinctKinds,
  distinctPublishedYears,
  initialSort,
  name,
  works,
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values: works,
    },
    initState,
  );

  return (
    <ListWithFiltersLayout
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
          deck={deck}
          name={name}
        />
      }
      data-pagefind-body
      filters={
        <Filters
          dispatch={dispatch}
          distinctKinds={distinctKinds}
          distinctPublishedYears={distinctPublishedYears}
          hideReviewed={state.hideReviewed}
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
            return <WorkListItem key={value.slug} value={value} />;
          }}
        </GroupedList>
      }
      totalCount={state.filteredValues.length}
    />
  );
}

function WorkListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem>
      <ListItemCover imageProps={value.coverImageProps} />
      <div className="flex grow flex-col items-start gap-y-1 tablet:w-full tablet:gap-y-2 desktop:pr-4">
        <ListItemTitle
          slug={value.reviewed ? value.slug : null}
          title={value.title}
        />
        <OtherAuthors values={value.otherAuthors} />
        <ListItemKindAndYear kind={value.kind} year={value.yearPublished} />
        <Grade height={16} value={value.grade} />
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
