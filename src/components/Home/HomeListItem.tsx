import type { CoverImageProps } from "src/api/covers";
import type { ReviewWithExcerpt } from "src/api/reviews";
import { AuthorLink } from "src/components/AuthorLink";
import { Cover } from "src/components/Cover";
import { Grade } from "src/components/Grade";
import { RenderedMarkdown } from "src/components/RenderedMarkdown";
import { toSentenceArray } from "src/utils";

export const CoverImageConfig = {
  width: 176,
  height: 264,
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
    <li className="relative flex even:bg-subtle">
      <article className="mx-auto flex max-w-[960px] flex-col items-center px-pageMargin py-10 tablet:grid tablet:w-full tablet:grid-cols-12 tablet:gap-x-6">
        <div className="whitespace-nowrap text-center text-sm font-light uppercase leading-4 tracking-0.75px text-subtle tablet:col-span-12 tablet:self-start tablet:leading-8 desktop:absolute desktop:left-[var(--page-margin-width)]">
          {formatDate(value.date)}
          <div className="spacer-y-6" />
        </div>
        <a
          rel="canonical"
          href={`/reviews/${value.slug}/`}
          className="cover-clip-path mx-auto block max-w-prose border-8 border-solid border-default bg-default tablet:col-span-4 tablet:mx-0 tablet:self-start tablet:justify-self-end"
        >
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
        </a>
        <div className="flex flex-col items-center tablet:col-span-8 tablet:items-start">
          <div className="spacer-y-4 tablet:spacer-y-0" />
          <h2 className="text-center text-2.5xl font-bold leading-8 tablet:text-left">
            <a
              href={`/reviews/${value.slug}/`}
              rel="canonical"
              className="inline-block"
            >
              {value.title}
            </a>
          </h2>
          <div className="text-sm font-light uppercase leading-8 tracking-0.75px text-subtle">
            {value.yearPublished} | {value.kind}
          </div>
          <p className="text-center">
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
          <div className="spacer-y-4" />
          {value.grade && <Grade value={value.grade} height={24} />}
          <div className="spacer-y-4" />
          <RenderedMarkdown
            text={value.excerpt}
            className="max-w-[34rem] text-lg leading-normal tracking-0.3px text-muted"
          />
        </div>
      </article>
    </li>
  );
}
