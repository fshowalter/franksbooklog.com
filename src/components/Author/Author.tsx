import { type JSX, useReducer } from "react";

import type { Author } from "~/api/authors";
import type { AvatarImageProps } from "~/api/avatars";
import type { BackdropImageProps } from "~/api/backdrops";
import type { CoverImageProps } from "~/api/covers";

import { Abandoned } from "~/components/Abandoned";
import { AvatarBackdrop, BreadcrumbLink } from "~/components/Backdrop";
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

export type Props = Pick<Author, "name"> & {
  avatarImageProps: AvatarImageProps | undefined;
  backdropImageProps: BackdropImageProps;
  deck: string;
  distinctKinds: readonly string[];
  distinctPublishedYears: readonly string[];
  initialSort: Sort;
  works: ListItemValue[];
};

export const AvatarImageConfig = {
  height: 250,
  width: 250,
};

export type ListItemValue = Pick<
  AuthorWork,
  | "grade"
  | "gradeValue"
  | "kind"
  | "slug"
  | "sortTitle"
  | "title"
  | "yearPublished"
> & {
  coverImageProps: CoverImageProps;
  otherAuthors: {
    name: string;
  }[];
};

type AuthorWork = Author["reviewedWorks"][number];

export function Author({
  avatarImageProps,
  backdropImageProps,
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
          backdropImageProps={backdropImageProps}
          breadcrumb={<BreadcrumbLink href="/authors/">Authors</BreadcrumbLink>}
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
          sortValue={state.sortValue}
        />
      }
      hasBackdrop={true}
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

function OtherAuthors({ values }: { values: ListItemValue["otherAuthors"] }) {
  if (values.length === 0) {
    return false;
  }

  return (
    <div className="font-sans text-xs leading-5 text-subtle">
      (with {toSentenceArray(values.map((value) => value.name))})
    </div>
  );
}

function WorkListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem
      className={`
        group/list-item transform-gpu transition-transform
        has-[a:hover]:z-30 has-[a:hover]:scale-105 has-[a:hover]:shadow-all
        has-[a:hover]:drop-shadow-2xl
      `}
    >
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
          flex grow flex-col items-start
          tablet:w-full tablet:pr-4
        `}
      >
        <ListItemTitle slug={value.slug} title={value.title} />
        <OtherAuthors values={value.otherAuthors} />
        <div
          className={`
            mt-1
            tablet:mt-2
          `}
        >
          <ListItemKindAndYear kind={value.kind} year={value.yearPublished} />
        </div>
        <Grade
          className={`
            mt-2
            tablet:mt-3
          `}
          height={16}
          value={value.grade}
        />
        <Abandoned value={value.grade} />
      </div>
    </ListItem>
  );
}
