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
        group/card relative row-span-2 grid max-w-[344px] grid-rows-subgrid
        gap-y-0 self-end border-(--bg-subtle)
        has-[a:hover]:[border-color:var(--bg-canvas)]
      `}
    >
      <div
        className={`
          relative self-end border-x-4 border-t-4 border-inherit bg-default px-3
          pt-3
          before:absolute before:inset-x-4 before:top-4 before:bottom-0
          before:aspect-(--cover-aspect) before:bg-default before:opacity-15
          group-hover/card:before:opacity-0
          min-[496px]:border-x-[16px] min-[496px]:border-t-[16px]
          min-[496px]:px-8 min-[496px]:pt-6 min-[496px]:before:inset-x-8
          min-[496px]:before:top-6
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
      </div>
      <div
        className={`
          flex w-full flex-col border-x-4 border-b-4 border-inherit bg-default
          px-1 pb-8
          min-[496px]:border-x-[16px] min-[496px]:border-b-[16px]
          min-[496px]:px-8 min-[496px]:pb-4
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
            pt-2 text-base leading-5 font-medium
            max:pt-2 max:text-xl
            tablet:pt-3 tablet:text-md
          `}
        >
          <a
            className={`
              block
              after:absolute after:top-0 after:left-0 after:z-10 after:size-full
              after:opacity-0
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
