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
    "(max-width: 599px) 48vw, (max-width: 767px) 31vw, (max-width: 899px) calc((100vw - 96px) * 0.32), (max-width: 1279px) calc((100vw - 96px) * 0.22.75), (max-width: 1695px) calc((100vw - 160px) * 0.1416666667), 218px",
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
    <li className="relative flex w-[48%] max-w-[248px] flex-col items-center border-default bg-default min-[600px]:w-[30.66666667%] tablet:w-[31.33333333%] min-[900px]:w-[22.75%] desktop:w-[14.16666667%]">
      <Cover
        decoding="async"
        imageProps={value.coverImageProps}
        {...CoverImageConfig}
        alt={`A cover of ${value.title} by ${toSentenceArray(
          value.authors.map((a) => a.name),
        ).join("")}`}
        loading={eagerLoadCoverImage ? "eager" : "lazy"}
      />
      <div className="flex grow flex-col items-center px-[8%] pb-8 pt-2 desktop:pl-[8.5%] desktop:pr-[10%]">
        <div className="whitespace-nowrap py-2 text-center font-sans text-xxs font-light uppercase leading-4 text-subtle">
          {formatDate(value.date)}
        </div>
        <div className="text-center text-md font-medium leading-6">
          <a
            className="z-10 inline-block decoration-2 underline-offset-4 before:absolute before:inset-x-0 before:top-0 before:aspect-cover before:bg-[#fff] before:opacity-15 hover:text-accent hover:underline hover:before:opacity-0"
            href={`/reviews/${value.slug}/`}
            rel="canonical"
          >
            {value.title}
          </a>
        </div>
        <div className="font-sans text-xxs font-light uppercase leading-8 tracking-wide text-subtle">
          {value.yearPublished} | {value.kind}
        </div>
        <p className="text-center text-base font-light text-subtle">
          by{" "}
          {toSentenceArray(
            value.authors.map((author) => {
              return (
                <AuthorLink
                  as="span"
                  className="font-normal text-accent"
                  key={author.slug}
                  name={author.name}
                  notes={author.notes}
                  slug={author.slug}
                />
              );
            }),
          )}
        </p>{" "}
        <Grade className="mt-2" height={18} value={value.grade} />
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
