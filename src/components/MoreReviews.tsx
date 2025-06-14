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
      className="mx-auto w-full max-w-screen-max bg-subtle tablet:max-w-popout desktop:max-w-screen-max desktop:px-container"
      data-page-find-ignore
    >
      <div className="px-container tablet:px-0">{children}</div>
      <ul className="flex flex-wrap justify-center gap-x-[4%] gap-y-[6vw] px-[4%] tablet:gap-x-[3%] tablet:px-0 desktop:justify-between desktop:gap-x-[1%]">
        {values.map((value) => {
          return <MoreReviewsCard key={value.slug} value={value} />;
        })}
      </ul>
    </nav>
  );
}

function MoreReviewsCard({ value }: { value: MoreReviewsValue }): JSX.Element {
  return (
    <li className="relative flex w-[48%] max-w-[248px] flex-col items-center border-default bg-default has-[a:hover]:bg-canvas has-[a:hover]:shadow-hover min-[600px]:w-[30.66666667%] tablet:w-[31.33333333%] desktop:w-[15.75%]">
      <Cover
        decoding="async"
        imageProps={value.coverImageProps}
        {...MoreReviewsImageConfig}
        alt=""
        loading="lazy"
      />
      <div className="flex w-full grow flex-col px-[8%] pb-8 desktop:pl-[8.5%] desktop:pr-[10%]">
        <div className="pt-4 font-sans text-sm font-medium tablet:pt-5 tablet:font-serif tablet:text-md tablet:leading-5 max:text-xl max:leading-6">
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
                  key={author.name}
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
