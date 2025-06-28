import type { JSX } from "react";

import type { CoverImageProps } from "~/api/covers";
import type { Review } from "~/api/reviews";

import { toSentenceArray } from "~/utils";

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
        mx-auto w-full max-w-(--breakpoint-max) bg-subtle px-container
        tablet:max-w-popout tablet:px-0
        desktop:max-w-(--breakpoint-max) desktop:px-container
      `}
      data-page-find-ignore
    >
      <div className={``}>{children}</div>
      <ul
        className={`
          -mx-4 flex flex-wrap content-stretch justify-center
          min-[500px]:-mx-12
          desktop:justify-between desktop:gap-y-4
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
        relative flex w-[48%] max-w-[344px] flex-col items-center border-default
        p-2
        has-[a:hover]:bg-canvas has-[a:hover]:shadow-hover
        max:w-[100%]
        min-[500px]:p-4
        min-[600px]:w-[33.33333333%]
        min-[1280px]:w-[16.66666667%]
      `}
    >
      <div
        className={`
          flex h-full w-full flex-col bg-default
          min-[500px]:px-8 min-[500px]:py-4
        `}
      >
        <Cover
          decoding="async"
          imageProps={value.coverImageProps}
          {...MoreReviewsImageConfig}
          alt=""
          loading="lazy"
        />
        <div
          className={`
            flex w-full grow flex-col bg-default px-[8%] pb-8
            min-[600px]:px-0 min-[600px]:pb-4
          `}
        >
          <div
            className={`
              pt-4 font-sans text-sm font-medium
              max:text-xl max:leading-6
              tablet:pt-5 tablet:font-serif tablet:text-md tablet:leading-5
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
