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
        mx-auto w-full max-w-[908px] bg-subtle px-container
        laptop:max-w-(--breakpoint-desktop) laptop:px-container
      `}
      data-page-find-ignore
    >
      <div>{children}</div>
      <ul
        className={`
          -mx-4 grid auto-rows-[auto_1fr] grid-cols-2 flex-wrap
          gap-x-[clamp(8px,2vw,32px)] gap-y-[clamp(8px,2vw,32px)]
          tablet:flex tablet:items-baseline tablet:gap-x-4 tablet:gap-y-4
          laptop:-mx-6 laptop:gap-x-6 laptop:gap-y-6
          desktop:-mx-8 desktop:gap-y-12
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
        group/card relative row-span-2 grid transform-gpu grid-rows-subgrid
        flex-col gap-y-0 bg-default transition-transform
        has-[a:hover]:z-10 has-[a:hover]:-translate-y-1 has-[a:hover]:scale-105
        has-[a:hover]:drop-shadow-2xl
        tablet:flex tablet:w-[calc((100%_-_32px)_/_3)]
        laptop:w-[calc((100%_-_120px)_/_6)]
      `}
    >
      <div
        className={`
          @container self-end
          tablet:self-auto
        `}
      >
        <div
          className={`
            flex justify-center px-3 pt-6
            desktop:pt-8
            @min-[200px]:px-[clamp(4px,12cqw,32px)]
          `}
        >
          <div
            className={`
              relative drop-shadow-md
              after:absolute after:inset-x-0 after:top-0 after:bottom-0
              after:z-20 after:rounded-[2.5px] after:bg-default after:opacity-15
              after:transition-opacity
              group-hover/card:after:opacity-0
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
      <div className={`@container`}>
        <div
          className={`
            flex w-full items-center bg-default px-3 pb-8
            @min-[200px]:px-[clamp(4px,12cqw,32px)] @min-[200px]:pb-6
          `}
        >
          <div className={`flex w-full max-w-[248px] flex-col px-1`}>
            <div
              className={`
                pt-4 text-base leading-5 font-medium
                @min-[238px]:text-md
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
                  @min-[238px]:inline
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
                @min-[238px]:mt-2 @min-[238px]:h-[14px] @min-[238px]:w-[70px]
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
                @min-[238px]:tracking-wide
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
