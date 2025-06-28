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
    "(min-width: 1840px) 248px, (min-width: 1300px) calc(13.08vw + 10px), (min-width: 1260px) calc(-360vw + 4784px), (min-width: 900px) calc(19.12vw + 11px), (min-width: 600px) 27.5vw, calc(41.43vw + 8px)",
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
    <li
      className={`
        relative flex w-[50%] max-w-[344px] grow flex-col items-center
        self-stretch p-2
        has-[a:hover]:bg-canvas has-[a:hover]:shadow-hover
        max:w-[100%]
        min-[600px]:w-[33.33333333%] min-[600px]:p-4
        min-[900px]:w-[25%]
        min-[1280px]:w-[16.66666667%]
      `}
    >
      <div
        className={`
          flex h-full w-full flex-col bg-default
          min-[600px]:px-8 min-[600px]:py-4
        `}
      >
        <Cover
          decoding="async"
          imageProps={value.coverImageProps}
          {...CoverImageConfig}
          alt={`A cover of ${value.title} by ${toSentenceArray(
            value.authors.map((a) => a.name),
          ).join("")}`}
          loading={eagerLoadCoverImage ? "eager" : "lazy"}
        />
        <div
          className={`
            flex w-full grow flex-col bg-default px-[8%] pb-8
            min-[600px]:px-0 min-[600px]:pb-4
          `}
        >
          <div
            className={`
              pt-3 font-sans text-xxs leading-4 font-light tracking-wide
              whitespace-nowrap text-subtle
            `}
          >
            {formatDate(value.date)}
          </div>
          <div
            className={`
              pt-2 font-sans text-sm font-medium
              max:pt-2 max:text-xl max:leading-6
              tablet:pt-3 tablet:font-serif tablet:text-md tablet:leading-5
            `}
          >
            <a
              className={`
                inline-block
                before:absolute before:inset-x-0 before:top-0
                before:aspect-cover before:bg-default before:opacity-15
                after:absolute after:top-0 after:left-0 after:z-10
                after:size-full after:opacity-0
                hover:text-accent hover:before:opacity-0
              `}
              href={`/reviews/${value.slug}/`}
              rel="canonical"
            >
              {value.title}
            </a>
          </div>
          <p
            className={`
              pt-1 font-sans text-xs leading-4 font-light text-subtle
              tablet:pt-2 tablet:font-serif tablet:text-base tablet:leading-5
            `}
          >
            <span
              className={`
                hidden
                tablet:inline
              `}
            >
              by{" "}
            </span>
            {toSentenceArray(
              value.authors.map((author) => {
                return (
                  <AuthorLink
                    as="span"
                    className=""
                    key={author.slug}
                    name={author.name}
                    notes={author.notes}
                  />
                );
              }),
            )}
          </p>{" "}
          <Grade
            className={`
              mt-2 h-4 w-20
              tablet:mt-3 tablet:h-[18px] tablet:w-[90px]
            `}
            height={16}
            value={value.grade}
          />
          <div
            className={`
              mt-auto pt-6 font-sans text-xxs leading-4 font-light tracking-wide
              text-subtle
            `}
          >
            {value.kind} | {value.yearPublished}
          </div>
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
