import type { CoverImageProps } from "src/api/covers";
import type { ReviewWithExcerpt } from "src/api/reviews";
import { AuthorLink } from "src/components/AuthorLink";
import { Cover } from "src/components/Cover";
import { Grade } from "src/components/Grade";
import { toSentenceArray } from "src/utils";

export const CoverImageConfig = {
  width: 250,
  height: 375,
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
    <li className="flex w-[48.5%] max-w-[250px] flex-col items-center border-default bg-default tablet:w-[31.33333333%] desktop:min-w-[250px]">
      <div className="opacity-85 hover:opacity-100">
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
      </div>
      <div className="flex grow flex-col items-center px-[8%] pb-8 pt-2 desktop:pl-[8.5%] desktop:pr-[10%]">
        <div className="whitespace-nowrap py-2 text-center font-sans text-xxs font-light uppercase leading-4 text-subtle">
          {formatDate(value.date)}
        </div>
        <div className="text-center text-md font-medium leading-6">
          <a
            href={`/reviews/${value.slug}/`}
            rel="canonical"
            className="inline-block"
          >
            {value.title}
          </a>
        </div>
        <div className="font-sans text-xxs font-light uppercase leading-8 tracking-wide text-subtle">
          {value.yearPublished} | {value.kind}
        </div>
        <p className="text-center text-base text-subtle">
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
                  className="text-accent"
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
