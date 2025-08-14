import type { JSX } from "react";

import type { CoverImageProps } from "~/api/covers";
import type { Review } from "~/api/reviews";

import { toSentenceArray } from "~/utils";

import { Abandoned } from "./Abandoned";
import { AuthorLink } from "./AuthorLink";
import { Cover } from "./Cover";
import { Grade } from "./Grade";

export const MoreReviewsImageConfig = {
  height: 372,
  sizes:
    "(min-width: 1800px) 218px, (min-width: 1280px) calc(11.8vw + 8px), (min-width: 820px) 216px, (min-width: 600px) calc(23.5vw + 28px), calc(41.43vw + 8px)",
  width: 248,
};

export type MoreReviewsValue = {
  authors: Author[];
  coverImageProps: CoverImageProps;
  grade: Review["grade"];
  kind: Review["kind"];
  slug: Review["slug"];
  title: Review["title"];
  yearPublished: Review["yearPublished"];
};

type Author = Pick<Review["authors"][0], "name" | "notes"> & {};

export function MoreReviews({
  children,
  values,
}: {
  children: React.ReactNode;
  values: MoreReviewsValue[];
}): JSX.Element {
  return (
    <nav
      className={`
        mx-auto w-full max-w-prose bg-subtle px-container
        tablet:px-0
        min-[1208px]:max-w-(--breakpoint-desktop) min-[1208px]:px-container
      `}
      data-page-find-ignore
    >
      <div>{children}</div>
      <ul
        className={`
          -mx-4 grid auto-rows-[auto_1fr] grid-cols-2 flex-wrap
          gap-x-[clamp(8px,2vw,32px)] gap-y-[clamp(8px,2vw,32px)]
          tablet:mx-0 tablet:flex tablet:items-baseline
          tablet:gap-x-[var(--gap-x)] tablet:gap-y-4 tablet:[--column-count:3]
          tablet:[--gap-x:calc(var(--spacing)_*_10)]
          min-[1208px]:[--column-count:6]
          laptop:[--gap-x:calc(var(--spacing)_*_11)]
          desktop:gap-y-12 desktop:[--gap-x:calc(var(--spacing)_*_16)]
        `}
      >
        {values.map((value) => {
          return <MoreReviewsCard key={value.slug} value={value} />;
        })}
      </ul>
    </nav>
  );
}

function MoreReviewsCard({ value }: { value: MoreReviewsValue }): JSX.Element {
  return (
    <li
      className={`
        group/list-item relative row-span-2 grid transform-gpu grid-rows-subgrid
        flex-col gap-y-0 bg-default transition-transform
        tablet:flex
        tablet:w-[calc((100%_-_var(--gaps-width))_/_var(--column-count))]
        tablet:bg-inherit
        tablet:[--gaps-width:var(--gap-x)_*_(var(--column-count)_-_1)]
      `}
    >
      <div
        className={`
          @container transform-gpu self-end transition-transform
          group-has-[a:hover]/list-item:-translate-y-2
          group-has-[a:hover]/list-item:drop-shadow-2xl
          tablet:self-auto
        `}
      >
        <div
          className={`
            flex justify-center px-3 pt-6
            tablet:px-0 tablet:pt-0
          `}
        >
          <div
            className={`
              relative drop-shadow-md
              after:absolute after:inset-x-0 after:top-0 after:bottom-0
              after:z-20 after:rounded-[2.5px] after:bg-default after:opacity-15
              after:transition-opacity
              group-hover/list-item:after:opacity-0
            `}
          >
            <Cover
              decoding="async"
              imageProps={value.coverImageProps}
              {...MoreReviewsImageConfig}
              alt=""
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <div
        className={`
          @container h-full self-start
          tablet:self-auto
        `}
      >
        <div
          className={`
            flex h-full flex-col items-center px-3 pb-8
            tablet:px-0
            @min-[200px]:px-[clamp(4px,12cqw,32px)] @min-[200px]:pb-6
            @min-[200px]:tablet:px-0
          `}
        >
          <div className={`flex h-full w-full max-w-[248px] flex-col px-1`}>
            <div
              className={`
                pt-4 text-base leading-5 font-medium
                @min-[225px]:text-md
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
              `}
            >
              <span
                className={`
                  hidden
                  @min-[225px]:inline
                `}
              >
                by{" "}
              </span>
              {toSentenceArray(
                value.authors.map((author) => {
                  return (
                    <AuthorLink
                      as="span"
                      key={author.name}
                      name={author.name}
                      notes={author.notes}
                    />
                  );
                }),
              )}
            </p>{" "}
            <Grade
              className={`
                mt-2 h-3 w-15
                @min-[225px]:mt-2 @min-[225px]:h-[14px] @min-[225px]:w-[70px]
              `}
              height={18}
              value={value.grade}
            />
            <Abandoned
              className={`
                mt-2 self-start
                tablet:mt-3
              `}
              value={value.grade}
            />
            <div
              className={`
                mt-auto pt-6 font-sans text-xxs leading-4 font-light text-subtle
                tablet:pt-3
                @min-[225px]:tracking-wide
              `}
            >
              {value.kind} | {value.yearPublished}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
