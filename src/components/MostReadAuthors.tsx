import type { CoverImageProps } from "~/api/covers";

import { ListItem } from "./ListItem";
import { ListItemCover } from "./ListItemCover";
import { ListItemTitle } from "./ListItemTitle";

type ReadingSubListItemValue = {
  coverImageProps: CoverImageProps;
  date: string;
  edition: string;
  kind: string;
  reviewed: boolean;
  sequence: number;
  slug: null | string;
  title: string;
  yearPublished: string;
};

type MostReadAuthorsValue = {
  count: number;
  name: string;
  readings: ReadingSubListItemValue[];
  slug: null | string;
};

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
            <div className="py-3" key={value.name}>
              <div className="flex justify-between px-container tablet:px-0">
                <div className="font-sans text-sm text-muted">
                  <Name value={value} />
                </div>
                <div className="col-start-2 self-center text-nowrap pb-1 text-right font-sans text-xs text-subtle">
                  {value.count}
                </div>
              </div>
              <div className="col-span-2 row-start-2 px-container tablet:px-0">
                <details className="bg-group tablet:px-2">
                  <summary className="cursor-pointer px-4 py-1 font-sans text-sm text-subtle tablet:px-0">
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

function Name({ value }: { value: MostReadAuthorsValue }): JSX.Element {
  if (value.slug) {
    return (
      <a
        className="inline-block font-normal leading-6 text-accent"
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
    <ListItem>
      <ListItemCover imageProps={value.coverImageProps} />
      <div className="flex grow flex-col gap-y-1">
        <ListItemTitle
          slug={value.reviewed ? value.slug : null}
          title={value.title}
        />
        <div className="-mt-px font-sans text-xs text-muted">{value.date}</div>
        <div className="mt-1 font-sans text-xs font-light text-muted">
          {value.edition}
        </div>
      </div>
    </ListItem>
  );
}
