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
    "(min-width: 1800px) 218px, (min-width: 1300px) calc(11.67vw + 10px), (min-width: 1260px) calc(-445vw + 5855px), (min-width: 900px) calc(19.12vw + 11px), (min-width: 600px) 27.5vw, calc(41.43vw + 8px)",
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
    <li className="relative flex w-[48%] max-w-[248px] flex-col items-center border-default bg-cover-back has-[a:hover]:shadow-hover min-[600px]:w-[30.66666667%] tablet:w-[31.33333333%] min-[900px]:w-[22.75%] desktop:w-[14.16666667%]">
      <Cover
        decoding="async"
        imageProps={value.coverImageProps}
        {...CoverImageConfig}
        alt={`A cover of ${value.title} by ${toSentenceArray(
          value.authors.map((a) => a.name),
        ).join("")}`}
        loading={eagerLoadCoverImage ? "eager" : "lazy"}
      />
      <div className="flex w-full grow flex-col items-center bg-default px-[8%] pb-8 pt-2 has-[a:hover]:bg-stripe desktop:pl-[8.5%] desktop:pr-[10%]">
        <div className="whitespace-nowrap py-2 text-center font-sans text-xxs font-light uppercase leading-4 text-subtle">
          {formatDate(value.date)}
        </div>
        <div className="text-center text-md font-medium leading-6">
          <a
            className="inline-block decoration-2 underline-offset-4 before:absolute before:inset-x-0 before:top-0 before:aspect-cover before:bg-default before:opacity-15 after:absolute after:left-0 after:top-0 after:z-10 after:size-full after:opacity-0 hover:text-accent hover:before:opacity-0"
            href={`/reviews/${value.slug}/`}
            rel="canonical"
          >
            {value.title}
          </a>
        </div>
        <div className="py-2 text-center font-sans text-xxs font-light uppercase leading-4 tracking-wide text-subtle">
          {value.yearPublished} | {value.kind}
        </div>
        <p className="py-3 text-center text-base font-light leading-5 text-subtle">
          by{" "}
          {toSentenceArray(
            value.authors.map((author) => {
              return (
                <AuthorLink
                  as="span"
                  className="font-normal text-default"
                  key={author.slug}
                  name={author.name}
                  notes={author.notes}
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
