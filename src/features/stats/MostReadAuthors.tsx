import type { CoverImageProps } from "~/api/covers";

import { CoverList } from "~/components/cover-list/CoverList";
import { CoverListItem } from "~/components/cover-list/CoverListItem";
import { ListItemEdition } from "~/components/list-item-edition/ListItemEdition";
import { ListItemReviewDate } from "~/components/list-item-review-date/ListItemReviewDate";
import { ListItemTitle } from "~/components/list-item-title/ListItemTitle";

export type MostReadAuthorsListItemValue = {
  count: number;
  name: string;
  readings: ReadingSubListItemValue[];
  reviewed: boolean;
  slug: string;
};

type ReadingSubListItemValue = {
  coverImageProps: CoverImageProps;
  displayDate: string;
  edition: string;
  readingSequence: number;
  reviewed: boolean;
  slug: string;
  title: string;
};

export function MostReadAuthors({
  values,
}: {
  values: readonly MostReadAuthorsListItemValue[];
}): false | React.JSX.Element {
  if (values.length === 0) {
    return false;
  }

  return (
    <section
      className={`
        w-full bg-default pb-8
        tablet:px-container
        laptop:px-12
      `}
    >
      <h2
        className={`
          px-container py-4 text-xl font-medium
          tablet:px-0
        `}
      >
        Most Read Authors
      </h2>
      <div className={`w-full`}>
        {values.map((value) => {
          return (
            <div className="py-3" key={value.name}>
              <div
                className={`
                  flex justify-between px-container
                  tablet:px-0
                `}
              >
                <div
                  className={`
                    transform-gpu font-sans text-xs text-muted
                    transition-transform
                    tablet:text-sm
                  `}
                >
                  <Name value={value} />
                </div>
                <div
                  className={`
                    col-start-2 self-center pr-1 pb-1 text-right font-sans
                    text-sm text-nowrap text-subtle
                  `}
                >
                  {value.count}
                </div>
              </div>
              <div
                className={`
                  col-span-2 row-start-2 px-container
                  tablet:px-0
                `}
              >
                <details
                  className={`
                    rounded-md bg-canvas px-2
                    open:pb-2
                  `}
                >
                  <summary
                    className={`
                      cursor-pointer rounded-sm py-1 font-sans text-sm
                      tracking-prose text-subtle
                    `}
                  >
                    Details
                  </summary>
                  <CoverList className="rounded-md bg-subtle">
                    {value.readings.map((reading) => {
                      return (
                        <MostReadAuthorReadingListItem
                          key={reading.readingSequence}
                          value={reading}
                        />
                      );
                    })}
                  </CoverList>
                </details>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MostReadAuthorReadingListItem({
  value,
}: {
  value: ReadingSubListItemValue;
}): React.JSX.Element {
  return (
    <CoverListItem
      className={`
        ${value.reviewed ? "bg-default" : "bg-transparent"}
      `}
      coverImageProps={value.coverImageProps}
    >
      <div
        className={`
          flex grow flex-col items-start gap-y-1
          tablet:mt-2 tablet:w-full tablet:px-1
        `}
      >
        <ListItemTitle
          slug={value.reviewed ? value.slug : undefined}
          title={value.title}
        />
        <ListItemReviewDate displayDate={value.displayDate} />
        <ListItemEdition value={value.edition} />
      </div>
    </CoverListItem>
  );
}

function Name({
  value,
}: {
  value: MostReadAuthorsListItemValue;
}): React.JSX.Element {
  if (value.reviewed) {
    return (
      <a
        className={`
          relative inline-block font-serif text-base/6 font-medium text-accent
          after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
          after:origin-bottom-left after:scale-x-0 after:bg-(--color-accent)
          after:transition-all after:duration-500
          hover:after:scale-x-100
        `}
        href={`/authors/${value.slug}/`}
      >
        {value.name}
      </a>
    );
  }

  return (
    <span
      className={`inline-block font-serif text-base/6 font-normal text-muted`}
    >
      {value.name}
    </span>
  );
}
