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
        group/card @container relative row-span-2 grid grid-rows-subgrid gap-y-0
        transition-transform
        has-[a:hover]:-translate-y-2 has-[a:hover]:drop-shadow-2xl
      `}
    >
      <div
        className={`
          z-10 flex justify-center self-end bg-default px-3 pt-3
          @min-[200px]:px-[clamp(4px,10cqw,32px)] @min-[200px]:pt-6
        `}
      >
        <div
          className={`
            relative
            after:absolute after:inset-x-0 after:top-0 after:bottom-0 after:z-20
            after:bg-default after:opacity-15 after:transition-opacity
            group-hover/card:after:opacity-0
          `}
        >
          <Cover
            decoding="async"
            imageProps={value.coverImageProps}
            {...CoverImageConfig}
            className={`max-w-[200px]`}
            loading={eagerLoadCoverImage ? "eager" : "lazy"}
          />
        </div>
      </div>
      <div
        className={`
          flex justify-center bg-default px-4 pb-8
          group-has-[a:hover]/card:shadow-[0px_-5px_5px_2px,rgba(0,0,0,.85)]
          @min-[193px]:px-[clamp(4px,14cqw,32px)] @min-[193px]:pb-6
        `}
      >
        <div className={`flex w-full max-w-[200px] flex-col`}>
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
              pt-2 text-base leading-5 font-medium
              tablet:pt-3 tablet:text-md
              desktop:pt-2 desktop:text-xl
            `}
          >
            <a
              className={`
                block
                after:absolute after:top-0 after:left-0 after:z-60
                after:size-full after:opacity-0
                hover:text-accent
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
