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
        mx-auto w-full max-w-(--breakpoint-desktop) bg-subtle px-container
        tablet:max-w-popout tablet:px-0
        laptop:max-w-(--breakpoint-desktop) laptop:px-container
      `}
      data-page-find-ignore
    >
      <div>{children}</div>
      <ul
        className={`
          grid auto-rows-[auto_1fr] grid-cols-2 gap-x-[clamp(8px,2vw,32px)]
          gap-y-[clamp(8px,2vw,32px)]
          tablet:grid-cols-3 tablet:gap-x-4 tablet:gap-y-4
          laptop:-mx-6 laptop:grid-cols-6 laptop:gap-x-6 laptop:gap-y-6
          desktop:-mx-8 desktop:grid-cols-6 desktop:gap-y-12
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
        group/card relative row-span-2 grid grid-rows-subgrid gap-y-0
        transition-transform
        has-[a:hover]:-translate-y-2 has-[a:hover]:drop-shadow-2xl
      `}
    >
      <div
        className={`
          @container flex justify-center self-end bg-default px-3 pt-3
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
            {...MoreReviewsImageConfig}
            alt=""
            className="max-w-[200px]"
            loading="lazy"
          />
        </div>
      </div>
      <div
        className={`
          @container flex justify-center bg-default px-4 pb-8
          @min-[193px]:px-[clamp(4px,14cqw,32px)] @min-[193px]:pb-6
        `}
      >
        <div className={`flex w-full max-w-[200px] flex-col`}>
          <div
            className={`
              pt-4 text-base leading-5 font-medium
              tablet:pt-5 tablet:text-md tablet:leading-5
              desktop:text-xl desktop:leading-6
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
              mt-2 h-4 w-20
              tablet:mt-3 tablet:h-[18px] tablet:w-[90px]
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
