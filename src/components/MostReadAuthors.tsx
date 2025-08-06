import type { JSX } from "react";

import type { CoverImageProps } from "~/api/covers";

import { ListItem } from "./ListItem";
import { ListItemCover } from "./ListItemCover";
import { ListItemTitle } from "./ListItemTitle";

type MostReadAuthorsValue = {
  count: number;
  name: string;
  readings: ReadingSubListItemValue[];
  slug: string | undefined;
};

type ReadingSubListItemValue = {
  coverImageProps: CoverImageProps;
  date: string;
  edition: string;
  kind: string;
  readingSequence: number;
  reviewed: boolean;
  slug: string | undefined;
  title: string;
  yearPublished: string;
};

export function MostReadAuthors({
  values,
}: {
  values: readonly MostReadAuthorsValue[];
}): false | JSX.Element {
  if (values.length === 0) {
    return false;
  }

  return (
    <section
      className={`
        w-full bg-default pb-8
        tablet:px-container
      `}
    >
      <h2
        className={`
          px-container py-4 font-medium
          tablet:px-0
          laptop:text-xl
        `}
      >
        Most Read Authors
      </h2>
      <div
        className={`
          w-full
          tablet:whitespace-nowrap
        `}
      >
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
                    origin-center transform-gpu font-sans text-xs text-muted
                    transition-transform
                    has-[a:hover]:scale-110
                    tablet:text-sm
                  `}
                >
                  <Name value={value} />
                </div>
                <div
                  className={`
                    col-start-2 self-center pb-1 text-right font-sans text-xs
                    text-nowrap text-subtle
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
                    bg-group
                    tablet:px-2
                  `}
                >
                  <summary
                    className={`
                      cursor-pointer px-4 py-1 font-sans text-sm text-subtle
                      tablet:px-0
                    `}
                  >
                    Details
                  </summary>
                  <ol
                    className={`
                      py-2
                      tablet:px-4
                    `}
                  >
                    {value.readings.map((reading) => {
                      return (
                        <ReadingSubListItem
                          key={`${reading.date}-${reading.slug}-${reading.readingSequence}`}
                          value={reading}
                        />
                      );
                    })}
                  </ol>
                </details>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Name({ value }: { value: MostReadAuthorsValue }): JSX.Element {
  if (value.slug) {
    return (
      <a
        className="inline-block leading-6 font-normal text-accent"
        href={`/authors/${value.slug}/`}
      >
        {value.name}
      </a>
    );
  }

  return <>{value.name}</>;
}

function ReadingSubListItem({ value }: { value: ReadingSubListItemValue }) {
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
          after:bg-default after:opacity-15
          group-has-[a:hover]/list-item:after:opacity-0
        `}
      >
        <ListItemCover imageProps={value.coverImageProps} />
      </div>
      <div className="flex grow flex-col gap-y-1">
        <ListItemTitle
          slug={value.reviewed ? value.slug : undefined}
          title={value.title}
        />
        <div className="mt-1 font-sans text-xs text-muted">{value.date}</div>
        <div className="mt-1 font-sans text-xs text-muted">{value.kind}</div>
        <div className="mt-1 font-sans text-xs font-light text-muted">
          {value.edition}
        </div>
      </div>
    </ListItem>
  );
}
