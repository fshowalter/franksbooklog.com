import type { CoverImageProps } from "src/api/covers";
import type { ReviewWithExcerpt } from "src/api/reviews";
import { AuthorLink } from "src/components/AuthorLink";
import { Cover } from "src/components/Cover";
import { Grade } from "src/components/Grade";
import { toSentenceArray } from "src/utils";

export const CoverImageConfig = {
  width: 248,
  height: 372,
};

function formatDate(reviewDate: Date) {
  return reviewDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export interface ListItemValue
  extends Pick<
    ReviewWithExcerpt,
    | "grade"
    | "sequence"
    | "slug"
    | "excerpt"
    | "date"
    | "title"
    | "kind"
    | "yearPublished"
    | "authors"
  > {
  coverImageProps: CoverImageProps;
}

export function HomeListItem({
  value,
  eagerLoadCoverImage,
}: {
  value: ListItemValue;
  eagerLoadCoverImage: boolean;
}): JSX.Element {
  return (
    <li className="relative flex w-[46%] max-w-[248px] flex-col items-center border-default bg-default tablet:w-[31.33333333%] desktop:w-[14.16666667%]">
      <Cover
        imageProps={value.coverImageProps}
        decoding="async"
        width={CoverImageConfig.width}
        height={CoverImageConfig.height}
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
            href={`/reviews/${value.slug}/`}
            rel="canonical"
            className="z-10 inline-block decoration-2 underline-offset-4 before:absolute before:inset-x-0 before:top-0 before:aspect-cover hover:text-accent hover:underline hover:before:opacity-0 tablet:before:bg-[#fff] before:tablet:opacity-15"
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
                  key={author.slug}
                  name={author.name}
                  notes={author.notes}
                  slug={author.slug}
                  className="font-normal text-accent"
                />
              );
            }),
          )}
        </p>{" "}
        <Grade value={value.grade} height={18} className="mt-2" />
      </div>
    </li>
  );
}
