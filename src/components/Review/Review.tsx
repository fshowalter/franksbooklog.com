import type { CoverImageProps } from "src/api/covers";
import type { Review, ReviewWithContent } from "src/api/reviews";
import { AuthorLink } from "src/components/AuthorLink";
import { Cover } from "src/components/Cover";
import { Grade } from "src/components/Grade";
import { LongFormText } from "src/components/LongFormText";
import { PageTitle } from "src/components/PageTitle";
import { toSentenceArray } from "src/utils/";

import { Layout } from "../Layout";
import { MoreReviews } from "../MoreReviews";
import { SubHeading } from "../SubHeading";
import { IncludedWorks } from "./IncludedWorks";
import { ReadingHistoryListItem } from "./ReadingHistoryListItem";
import { StructuredData } from "./StructuredData";

export const CoverImageConfig = {
  width: 248,
  height: 372,
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(date: Date) {
  return dateFormat.format(date);
}

export interface Props {
  value: ReviewWithContent;
  coverImageProps: CoverImageProps;
  seoImageSrc: string;
  moreReviews: React.ComponentProps<typeof MoreReviews>["values"];
}

export function Review({
  value,
  coverImageProps,
  seoImageSrc,
  moreReviews,
}: Props): JSX.Element {
  return (
    <Layout hasBackdrop={false} className="flex flex-col" data-pagefind-body>
      <header className="mb-12 flex flex-col items-center px-[8%] pt-10">
        <h1
          data-pagefind-meta="title"
          className="text-center text-4xl desktop:text-6xl"
        >
          {value.title}
          {value.subtitle && (
            <div className="max-w-prose pt-2 text-base font-light tracking-wider text-muted">
              {value.subtitle}
            </div>
          )}
        </h1>
        <Authors
          values={value.authors}
          className="mt-4 text-center text-md text-muted"
        />
        <div className="mt-4">
          <ReviewGrade value={value.grade} />
        </div>
        <YearAndKind
          yearPublished={value.yearPublished}
          kind={value.kind}
          className="mt-5 font-sans text-xs font-light uppercase tracking-wide text-subtle"
        />
        <ReviewCover coverImageProps={coverImageProps} />
      </header>
      <div className="flex flex-col items-center gap-16 px-container pb-20 desktop:gap-20 desktop:pb-32">
        <LongFormText
          className="max-w-prose first-letter:leading-[.8] first-letter:text-default tablet:first-letter:pr-3 desktop:first-letter:text-[64px] [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mt-[6px] [&>p:first-child]:first-letter:pr-2 [&>p:first-child]:first-letter:font-sans [&>p:first-child]:first-letter:text-[56px] [&>p:first-child]:first-letter:font-bold"
          text={value.content}
        />
        {value.includedWorks.length > 0 && (
          <div className="w-full max-w-popout">
            <IncludedWorks values={value.includedWorks} />
          </div>
        )}
        <div className="w-full max-w-popout">
          <SubHeading as="h2" className="shadow-bottom">
            Reading History
          </SubHeading>
          <ul>
            {value.readings.map((value) => (
              <ReadingHistoryListItem key={value.sequence} value={value} />
            ))}
          </ul>
        </div>
      </div>

      <div
        data-pagefind-ignore
        className="flex w-full flex-col items-center gap-y-12 bg-subtle pb-32 pt-16 tablet:pt-8 desktop:gap-y-24"
      >
        <MoreReviews values={moreReviews}>
          <SubHeading as="h2">
            More{" "}
            <a href={`/reviews/`} className="text-accent">
              Reviews
            </a>
          </SubHeading>
        </MoreReviews>
      </div>
      <StructuredData
        title={value.title}
        grade={value.grade}
        seoImageSrc={seoImageSrc}
      />
    </Layout>
  );
}

function YearAndKind({
  yearPublished,
  kind,
  className,
}: {
  yearPublished: ReviewWithContent["yearPublished"];
  kind: ReviewWithContent["kind"];
  className: string;
}) {
  return (
    <div className={className}>
      <span className="tracking-wide">{yearPublished}</span> | {kind}
    </div>
  );
}

function Authors({
  values,
  className,
}: {
  values: ReviewWithContent["authors"];
  className: string;
}) {
  return (
    <div className={className}>
      by{" "}
      {toSentenceArray(
        values.map((author) => (
          <AuthorLink
            key={author.slug}
            name={author.name}
            slug={author.slug}
            notes={author.notes}
            className="inline-block text-accent"
          />
        )),
      )}
    </div>
  );
}

function ReviewCover({
  coverImageProps,
}: {
  coverImageProps: CoverImageProps;
}) {
  return (
    <div
      data-pagefind-meta={`image:${coverImageProps.src}`}
      className="relative my-12 flex h-[340px] w-full max-w-popout flex-col items-center"
    >
      <div
        data-pagefind-meta={`image_alt:${coverImageProps.alt}`}
        className="cover-clip-path absolute inset-0 overflow-hidden"
      >
        <div
          style={{
            backgroundColor: "var(--bg-default)",
            backgroundImage: `linear-gradient(90deg, rgba(var(--bg-default-rgb),1) 0%, rgba(var(--bg-default-rgb),var(--bg-default-alpha)) 30%, rgba(var(--bg-default-rgb),0) 50%, rgba(var(--bg-default-rgb),var(--bg-default-alpha)) 70%, rgba(var(--bg-default-rgb),1) 100%), url(${coverImageProps.src})`,
          }}
          className={
            "absolute left-[-5%] top-[-5%] size-[110%] bg-default bg-cover bg-center"
          }
        />
        <div className="absolute size-full backdrop-blur" />
      </div>
      <div className="relative -top-4 z-10 h-[372px] shadow-[0_5px_20px_rgba(49,46,42,0.22)]">
        <Cover
          imageProps={coverImageProps}
          width={CoverImageConfig.width}
          height={CoverImageConfig.height}
          loading={"eager"}
          decoding="async"
          className="safari-border-radius-fix shadow-[0_5px_20px_rgba(49,46,42,0.22)]"
        />
      </div>
    </div>
  );
}

function ReviewGrade({ value }: { value: ReviewWithContent["grade"] }) {
  if (value == "Abandoned") {
    return (
      <div className="bg-abandoned px-2 py-1 font-sans text-sm font-medium uppercase tracking-wide text-[#fff]">
        Abandoned
      </div>
    );
  }
  return <Grade value={value} height={32} />;
}
