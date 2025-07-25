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
    "(min-width: 1860px) 200px, (min-width: 1440px) calc(9.75vw + 21px), (min-width: 1280px) calc(16.43vw - 59px), (min-width: 1040px) calc(6.36vw + 120px), (min-width: 960px) 200px, (min-width: 780px) calc(11.25vw + 94px), (min-width: 620px) 200px, (min-width: 460px) calc(25.71vw + 46px), calc(42.14vw - 12px)",
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
        group/list-item relative row-span-2 grid transform-gpu grid-rows-subgrid
        flex-col transition-transform
        tablet:flex tablet:w-[calc((100%_-_32px)_/_3)]
        tablet-landscape:w-[calc((100%_-_48px)_/_4)]
        laptop:w-[calc((100%_-_200px)_/_6)]
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
            z-10 flex justify-center px-3 pt-6
            tablet:px-0 tablet:pt-0
            desktop:pt-8
          `}
        >
          <div
            className={`
              relative drop-shadow-md
              after:absolute after:inset-x-0 after:top-0 after:bottom-0
              after:z-20 after:bg-default after:opacity-15
              after:transition-opacity
              group-hover/list-item:after:opacity-0
            `}
          >
            <Cover
              decoding="async"
              imageProps={value.coverImageProps}
              {...CoverImageConfig}
              loading={eagerLoadCoverImage ? "eager" : "lazy"}
            />
          </div>
        </div>
      </div>
      <div className={`@container`}>
        <div
          className={`
            flex flex-col items-center px-3 pb-8
            tablet:px-0
            @min-[200px]:px-[clamp(4px,12cqw,32px)] @min-[200px]:pb-6
            @min-[200px]:tablet:px-0
          `}
        >
          <div className={`flex w-full max-w-[248px] flex-col px-1`}>
            <div
              className={`
                pt-3 font-sans text-xxs leading-4 font-light whitespace-nowrap
                text-subtle
                @min-[238px]:tracking-wide
              `}
            >
              {formatDate(value.date)}
            </div>
            <div
              className={`
                pt-2 text-base leading-5 font-medium
                tablet:pt-3
                @min-[238px]:pt-2 @min-[238px]:text-md
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
                mt-2 h-3 w-15
                @min-[238px]:mt-2 @min-[238px]:h-[14px] @min-[238px]:w-[70px]
              `}
              height={16}
              value={value.grade}
            />
            <div
              className={`
                mt-auto pt-6 font-sans text-xxs leading-4 font-light text-subtle
                tablet:pt-3
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

function formatDate(reviewDate: Date) {
  return reviewDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  });
}
