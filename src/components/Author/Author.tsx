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
import type { Sort } from "./Author.reducer";
import { Actions, initState, reducer } from "./Author.reducer";
import { Filters } from "./Filters";
import { Header } from "./Header";
import { List, type ListItemValue } from "./List";

export interface Props
  extends Pick<Author, "name" | "reviewedWorkCount" | "shelfWorkCount"> {
  works: ListItemValue[];
  distinctKinds: readonly string[];
  distinctPublishedYears: readonly string[];
  initialSort: Sort;
  avatarImageProps: AvatarImageProps | null;
}

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
  reviewedWorkCount,
  shelfWorkCount,
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
      mastGradient={false}
      backdrop={
        <AvatarBackdrop
          avatarImageProps={avatarImageProps}
          breadcrumb={
            <a
              className="px-4 hover:bg-default hover:text-default"
              href="authors/"
            >
              Authors
            </a>
          }
          name={name}
          deck={
            <Deck
              reviewedWorkCount={reviewedWorkCount}
              shelfWorkCount={shelfWorkCount}
            />
          }
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
            return <WorkListItem value={value} key={value.imdbId} />;
          }}
        </GroupedList>
      }
    />
  );
}

function WorkListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem>
      <ListItemCover
        slug={value.reviewed ? value.slug : null}
        imageProps={value.coverImageProps}
      />
      <div className="pr-gutter grow tablet:w-full desktop:pr-4">
        <div>
          <ListItemTitle
            title={value.title}
            slug={value.reviewed ? value.slug : null}
          />
          <OtherAuthors values={value.otherAuthors} />
          <div className="spacer-y-2" />
          <YearAndKind year={value.yearPublished} kind={value.kind} />
          <div className="spacer-y-2" />
          <Grade value={value.grade} height={16} />
          <div className="spacer-y-2" />
        </div>
      </div>
    </ListItem>
  );
}

function OtherAuthors({ values }: { values: ListItemValue["otherAuthors"] }) {
  if (values.length === 0) {
    return null;
  }

  return (
    <>
      <div className="spacer-y-1" />
      <div className="text-base leading-5 text-muted">
        (with {toSentenceArray(values.map((value) => value.name))})
      </div>
    </>
  );
}

function YearAndKind({
  kind,
  year,
}: {
  kind: string;
  year: string;
}): JSX.Element | null {
  return (
    <div className="tracking-0.5px text-sm leading-4 text-subtle">
      <span>{kind} | </span>
      {year}
    </div>
  );
}

function Deck({
  reviewedWorkCount,
  shelfWorkCount,
}: {
  reviewedWorkCount: Author["reviewedWorkCount"];
  shelfWorkCount: Author["shelfWorkCount"];
}): JSX.Element {
  let shelfText = <></>;

  if (shelfWorkCount > 0) {
    shelfText = (
      <>
        , and <span className="text-emphasis">{shelfWorkCount}</span> titles on
        the shelf
      </>
    );
  }

  let works = "works";

  if (reviewedWorkCount === 1) {
    works = "work";
  }

  return (
    <div className="px-gutter text-center text-subtle">
      Author of <span className="text-emphasis">{reviewedWorkCount}</span>{" "}
      reviewed {works}
      {shelfText}.
    </div>
  );
}
