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
        has-[a:hover]:-translate-y-2
      `}
    >
      <div
        className={`
          flex justify-center self-end bg-default px-3 pt-3
          @min-[200px]:px-[clamp(4px,10cqw,32px)] @min-[200px]:pt-6
        `}
      >
        <div
          className={`
            relative max-w-[200px] transition-opacity
            before:absolute before:top-0 before:left-0 before:block
            before:size-full before:bg-[url(/assets/spot.png)]
            before:bg-size-[100%_100%] before:mix-blend-soft-light
            after:absolute after:inset-x-0 after:top-0 after:bottom-0 after:z-20
            after:bg-default after:opacity-15
            group-hover/card:after:opacity-0
            @min-[160px]:shadow-lg
          `}
        >
          <div
            className={`
              relative z-10
              before:absolute before:top-0 before:left-0 before:z-10
              before:block before:size-full before:rounded-[2.5px]
              before:bg-[url(/assets/spine-light.png)]
              before:bg-size-[100%_100%]
              after:absolute after:top-0 after:left-0 after:z-10 after:block
              after:size-full after:rounded-[2.5px]
              after:bg-[url(/assets/spine-dark.png)] after:bg-size-[100%_100%]
              after:mix-blend-multiply
            `}
          >
            <Cover
              decoding="async"
              imageProps={value.coverImageProps}
              {...CoverImageConfig}
              alt={`A cover of ${value.title} by ${toSentenceArray(
                value.authors.map((a) => a.name),
              ).join("")}`}
              className="rounded-[2.5px] bg-default"
              loading={eagerLoadCoverImage ? "eager" : "lazy"}
            />
          </div>
        </div>
      </div>
      <div
        className={`
          flex justify-center bg-default px-4 pb-8
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
