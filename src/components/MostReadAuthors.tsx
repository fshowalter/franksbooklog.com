import type { CoverImageProps } from "src/api/covers";

import { ListItem } from "./ListItem";
import { ListItemCover } from "./ListItemCover";
import { ListItemKindAndYear } from "./ListItemKindAndYear";
import { ListItemTitle } from "./ListItemTitle";
import { StatHeading } from "./StatHeading";

interface ReadingSubListItemValue {
  sequence: number;
  date: Date;
  edition: string;
  kind: string;
  title: string;
  yearPublished: string;
  slug: string | null;
  coverImageProps: CoverImageProps;
  reviewed: boolean;
}

interface MostReadAuthorsValue {
  name: string;
  slug: string | null;
  count: number;
  readings: ReadingSubListItemValue[];
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function MostReadAuthors({
  values,
}: {
  values: readonly MostReadAuthorsValue[];
}): JSX.Element | null {
  if (values.length == 0) {
    return null;
  }

  return (
    <section className="w-full bg-default pb-8 tablet:px-container">
      <h2 className="px-container py-4 font-medium tablet:px-0 desktop:text-xl">
        Most Read Authors
      </h2>
      <div className="w-full tablet:whitespace-nowrap">
        {values.map((value) => {
          return (
            <div key={value.name} className="py-3">
              <div className="flex justify-between px-container tablet:px-0">
                <div className="font-sans text-sm text-muted">
                  <Name value={value} />
                </div>
                <div className="col-start-2 self-center text-nowrap pb-1 text-right font-sans text-xs text-subtle">
                  {value.count}
                </div>
              </div>
              <div className="col-span-2 row-start-2 bg-subtle">
                <details className="bg-subtle tablet:px-2">
                  <summary className="cursor-pointer px-container py-1 font-sans text-sm text-subtle tablet:px-0">
                    Details
                  </summary>
                  <ol className="py-2 tablet:px-4">
                    {value.readings.map((viewing) => {
                      return (
                        <ReadingSubListItem
                          key={viewing.sequence}
                          value={viewing}
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

function Name({ value }: { value: ListItemValue }): JSX.Element {
  if (value.slug) {
    return (
      <a className="text-accent" href={`/authors/${value.slug}/`}>
        {value.name}
      </a>
    );
  }

  return <>{value.name}</>;
}

function ReadingSubListItem({ value }: { value: ReadingSubListItemValue }) {
  return (
    <ListItem className="items-center">
      <ListItemCover
        slug={value.reviewed ? value.slug : null}
        imageProps={value.coverImageProps}
      />
      <div className="grow">
        <div>
          <ListItemTitle
            title={value.title}
            slug={value.reviewed ? value.slug : null}
          />
          <div className="spacer-y-2" />
          <ListItemKindAndYear year={value.yearPublished} kind={value.kind} />
          <div className="spacer-y-2" />
          <div className="text-base leading-4 text-subtle">
            {value.edition} on {dateFormatter.format(value.date)}
          </div>
          <div className="spacer-y-2" />
        </div>
        <div className="spacer-y-2" />
      </div>
    </ListItem>
  );
}
