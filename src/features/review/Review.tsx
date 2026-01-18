import type { CoverImageProps } from "~/api/covers";
import type { Review, ReviewWithContent } from "~/api/reviews";
import type { ReviewCardValue } from "~/components/review-card/ReviewCard";

import { Cover } from "~/components/cover/Cover";
import { Grade } from "~/components/grade/Grade";
import { LongFormText } from "~/components/long-form-text/LongFormText";
import { MoreReviews } from "~/components/more-reviews/MoreReviews";
import { MoreReviewsHeading } from "~/components/more-reviews/MoreReviewsHeading";
import { SubHeading } from "~/components/sub-heading/SubHeading";
import { toSentenceArray } from "~/utils/toSentenceArray";

import { AuthorLink } from "./AuthorLink";
import { IncludedWorks } from "./IncludedWorks";
import { ReadingHistoryListItem } from "./ReadingHistoryListItem";
import { StructuredData } from "./StructuredData";

/**
 * Configuration for cover images in the review page.
 * Defines the width for the main review cover image.
 */
export const CoverImageConfig = {
  /** Cover image width in pixels */
  width: 248,
};

/**
 * Props interface for the Review page component.
 * Contains all data needed to render a single review page.
 */
export type ReviewProps = {
  /** Cover image props for the main work cover */
  coverImageProps: CoverImageProps;
  /** Array of related reviews for the "More Reviews" section */
  moreReviews: ReviewCardValue[];
  /** Cover image source URL for structured data */
  structuredDataCoverSrc: string;
  /** Review data including content and metadata */
  value: ReviewWithContent;
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

export function Review({
  coverImageProps,
  moreReviews,
  structuredDataCoverSrc,
  value,
}: ReviewProps): React.JSX.Element {
  return (
    <div className="flex flex-col" data-pagefind-body>
      <header
        className={`
          relative z-base mb-12 flex flex-col items-center px-[8%] pt-10
        `}
      >
        <nav className={`transform-gpu pb-2 transition-transform`}>
          <a
            className={`
              relative inline-block pb-1 font-sans text-xs tracking-wider
              text-subtle uppercase transition-all
              after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
              after:origin-center after:scale-x-0 after:bg-(--color-accent)
              after:transition-transform
              hover:text-accent
              hover:after:scale-x-100
            `}
            href="/reviews/"
          >
            Reviews
          </a>
        </nav>
        <h1
          className={`
            text-center text-4xl
            laptop:text-5xl
            desktop:text-6xl
          `}
          data-pagefind-meta="title"
        >
          {value.title}
        </h1>
        {value.subtitle && (
          <p
            className={`
              max-w-prose pt-2 text-center text-base font-light tracking-wider
              text-muted
            `}
          >
            {value.subtitle}
          </p>
        )}
        <Authors
          className={`mt-4 text-center text-md text-muted`}
          values={value.authors}
        />
        <div className="mt-4">
          <ReviewGrade value={value.grade} />
        </div>
        <YearAndKind
          className={`
            mt-5 mb-4 text-center font-sans text-sm tracking-wide text-subtle
            uppercase
            tablet:mb-6
          `}
          kind={value.kind}
          workYear={value.workYear}
        />
        <ReviewCover coverImageProps={coverImageProps} />
        <div
          className={`
            relative mt-4 bg-default px-[1ch] font-sans text-xs tracking-wide
            text-subtle uppercase
            after:absolute after:top-1/2 after:left-[-11%] after:-z-10
            after:w-[122%] after:border-t after:border-subtle
            tablet:mt-6
          `}
        >
          Reviewed {dateFormat.format(value.date)}
        </div>
      </header>
      <div
        className={`
          flex flex-col items-center gap-16 px-container pb-20
          desktop:gap-20 desktop:pb-32
        `}
      >
        <LongFormText
          className={`
            max-w-prose
            first-letter:leading-[.8] first-letter:text-default
            tablet:first-letter:pr-3
            desktop:first-letter:text-[64px]
            [&>p:first-child]:first-letter:float-left
            [&>p:first-child]:first-letter:mt-[6px]
            [&>p:first-child]:first-letter:pr-2
            [&>p:first-child]:first-letter:font-sans
            [&>p:first-child]:first-letter:text-[56px]
            [&>p:first-child]:first-letter:font-bold
          `}
          text={value.content}
        />
        {value.includedWorks.length > 0 && (
          <div className="w-full max-w-popout">
            <IncludedWorks values={value.includedWorks} />
          </div>
        )}
        <div className="w-full max-w-popout">
          <SubHeading as="h2" className="text-center shadow-bottom">
            Reading History
          </SubHeading>
          <ul>
            {value.readings.map((value) => (
              <ReadingHistoryListItem
                key={`${value.date.toISOString()}-${value.readingSequence}`}
                value={value}
              />
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`
          flex w-full flex-col items-center gap-y-12 bg-subtle pt-16 pb-32
          tablet:pt-8
          laptop:gap-y-24
        `}
        data-pagefind-ignore
      >
        <MoreReviews values={moreReviews}>
          <MoreReviewsHeading
            accentText="Reviews"
            href={`/reviews/`}
            text="More"
          />
        </MoreReviews>
      </div>
      <StructuredData
        coverImgSrc={structuredDataCoverSrc}
        grade={value.grade}
        title={value.title}
      />
    </div>
  );
}

function Authors({
  className,
  values,
}: {
  className: string;
  values: ReviewWithContent["authors"];
}): React.JSX.Element {
  return (
    <div className={className}>
      by{" "}
      {toSentenceArray(
        values.map((author) => (
          <AuthorLink
            className={`
              relative inline-block transform-gpu text-accent
              transition-transform
              after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
              after:origin-center after:scale-x-0 after:bg-(--color-accent)
              after:transition-transform
              hover:after:scale-x-100
            `}
            key={author.slug}
            name={author.name}
            notes={author.notes}
            slug={author.slug}
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
}): React.JSX.Element {
  return (
    <div
      className={`
        @container relative my-12 flex w-full max-w-popout flex-col items-center
      `}
      data-pagefind-meta={`image:${coverImageProps.src}`}
    >
      <div
        className={`
          absolute top-[2.5%] left-[2.5%] size-[95%] overflow-hidden bg-default
          bg-cover bg-center clip-path-cover
          after:absolute after:size-full after:backdrop-blur-sm
          after:clip-path-cover
          tablet:-left-[2.5%] tablet:w-[105%]
        `}
        style={{
          backgroundColor: "var(--background-color-default)",
          backgroundImage: `linear-gradient(90deg, rgba(var(--bg-default-rgb),1) 0%, rgba(var(--bg-default-rgb),var(--bg-default-alpha)) 30%, rgba(var(--bg-default-rgb),0) 50%, rgba(var(--bg-default-rgb),var(--bg-default-alpha)) 70%, rgba(var(--bg-default-rgb),1) 100%), url(${coverImageProps.src})`,
        }}
      />
      <Cover
        className={`-top-[2.5%]`}
        decoding="auto"
        imageProps={coverImageProps}
        loading="eager"
      />
    </div>
  );
}

function ReviewGrade({
  value,
}: {
  value: ReviewWithContent["grade"];
}): React.JSX.Element {
  if (value == "Abandoned") {
    return (
      <div
        className={`
          bg-abandoned px-2 py-1 font-sans text-sm font-medium tracking-wide
          text-white uppercase
        `}
      >
        Abandoned
      </div>
    );
  }
  return <Grade height={32} value={value} />;
}

function YearAndKind({
  className,
  kind,
  workYear,
}: {
  className: string;
  kind: ReviewWithContent["kind"];
  workYear: ReviewWithContent["workYear"];
}): React.JSX.Element {
  return (
    <div className={className}>
      {workYear} | {kind}
    </div>
  );
}
