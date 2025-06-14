import type { JSX } from "react";

import type { CoverImageProps } from "~/api/covers";
import type { ReviewWithExcerpt } from "~/api/reviews";

import { AuthorLink } from "~/components/AuthorLink";
import { Cover } from "~/components/Cover";
import { Grade } from "~/components/Grade";
import { toSentenceArray } from "~/utils";

export const CoverImageConfig = {
  height: 372,
  sizes:
    "(min-width: 1800px) 218px, (min-width: 1300px) calc(11.67vw + 10px), (min-width: 1260px) calc(-445vw + 5855px), (min-width: 900px) calc(19.12vw + 11px), (min-width: 600px) 27.5vw, calc(41.43vw + 8px)",
  width: 248,
};

export type ListItemValue = Pick<
  ReviewWithExcerpt,
  | "authors"
  | "date"
  | "excerpt"
  | "grade"
  | "kind"
  | "sequence"
  | "slug"
  | "title"
  | "yearPublished"
> & {
  coverImageProps: CoverImageProps;
};

export function HomeListItem({
  eagerLoadCoverImage,
  value,
}: {
  eagerLoadCoverImage: boolean;
  value: ListItemValue;
}): JSX.Element {
  return (
    <li className="relative flex w-[48%] max-w-[248px] flex-col items-center border-default bg-default has-[a:hover]:bg-canvas has-[a:hover]:shadow-hover min-[600px]:w-[30.66666667%] tablet:w-[31.33333333%] min-[900px]:w-[22.75%] desktop:w-[15.75%]">
      <Cover
        decoding="async"
        imageProps={value.coverImageProps}
        {...CoverImageConfig}
        alt={`A cover of ${value.title} by ${toSentenceArray(
          value.authors.map((a) => a.name),
        ).join("")}`}
        loading={eagerLoadCoverImage ? "eager" : "lazy"}
      />
      <div className="flex w-full grow flex-col px-[8%] pb-8 desktop:pl-[8.5%] desktop:pr-[10%]">
        <div className="whitespace-nowrap pt-3 font-sans text-xxs font-light leading-4 tracking-wide text-subtle">
          {formatDate(value.date)}
        </div>
        <div className="pt-2 font-sans text-sm font-medium tablet:pt-3 tablet:font-serif tablet:text-md tablet:leading-5 max:pt-2 max:text-xl max:leading-6">
          <a
            className="inline-block before:absolute before:inset-x-0 before:top-0 before:aspect-cover before:bg-default before:opacity-15 after:absolute after:left-0 after:top-0 after:z-10 after:size-full after:opacity-0 hover:text-accent hover:before:opacity-0"
            href={`/reviews/${value.slug}/`}
            rel="canonical"
          >
            {value.title}
          </a>
        </div>
        <p className="pt-1 font-sans text-xs font-light leading-4 text-subtle tablet:pt-2 tablet:font-serif tablet:text-base tablet:leading-5">
          by{" "}
          {toSentenceArray(
            value.authors.map((author) => {
              return (
                <AuthorLink
                  as="span"
                  className="font-normal text-default"
                  key={author.slug}
                  name={author.name}
                  notes={author.notes}
                />
              );
            }),
          )}
        </p>{" "}
        <Grade
          className="mt-2 h-4 w-20 tablet:mt-3 tablet:h-[18px] tablet:w-[90px]"
          height={18}
          value={value.grade}
        />
        <div className="mt-auto pt-6 font-sans text-xxs font-light leading-4 tracking-wide text-subtle">
          {value.kind} | {value.yearPublished}
        </div>
      </div>
    </li>
  );
}

function formatDate(reviewDate: Date) {
  return reviewDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  });
}
