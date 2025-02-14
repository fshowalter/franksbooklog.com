import type { JSX } from "react";

import type { FixedCoverImageProps } from "~/api/covers";
import type { Review, ReviewWithContent } from "~/api/reviews";

import { AuthorLink } from "~/components/AuthorLink";
import { Cover } from "~/components/Cover";
import { Grade } from "~/components/Grade";
import { Layout } from "~/components/Layout";
import { LongFormText } from "~/components/LongFormText";
import { MoreReviews } from "~/components/MoreReviews";
import { SubHeading } from "~/components/SubHeading";
import { toSentenceArray } from "~/utils/";

import { IncludedWorks } from "./IncludedWorks";
import { ReadingHistoryListItem } from "./ReadingHistoryListItem";
import { StructuredData } from "./StructuredData";

export const CoverImageConfig = {
  height: 372,
  width: 248,
};

export type Props = {
  coverImageProps: FixedCoverImageProps;
  moreReviews: React.ComponentProps<typeof MoreReviews>["values"];
  structuredDataCoverSrc: string;
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
}: Props): JSX.Element {
  return (
    <Layout className="flex flex-col" data-pagefind-body hasBackdrop={false}>
      <header className="relative z-[1] mb-12 flex flex-col items-center px-[8%] pt-10">
        <nav className="pb-3">
          <a
            className="font-sans text-xs uppercase tracking-wider text-accent"
            href="/reviews/"
          >
            Reviews
          </a>
        </nav>
        <h1
          className="text-center text-4xl desktop:text-6xl"
          data-pagefind-meta="title"
        >
          {value.title}
        </h1>
        {value.subtitle && (
          <p className="max-w-prose pt-2 text-base font-light tracking-wider text-muted">
            {value.subtitle}
          </p>
        )}
        <Authors
          className="mt-4 text-center text-md text-muted"
          values={value.authors}
        />
        <div className="mt-4">
          <ReviewGrade value={value.grade} />
        </div>
        <YearAndKind
          className="mb-4 mt-5 font-sans text-xs font-light uppercase tracking-wide text-subtle tablet:mb-6"
          kind={value.kind}
          yearPublished={value.yearPublished}
        />
        <ReviewCover coverImageProps={coverImageProps} />
        <div className="relative mt-4 bg-default px-[1ch] font-sans text-xs uppercase tracking-wide text-subtle after:absolute after:left-[-11%] after:top-1/2 after:-z-10 after:w-[122%] after:border-t after:border-[var(--fg-subtle)] tablet:mt-6">
          Reviewed {dateFormat.format(value.date)}
        </div>
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
          <SubHeading as="h2" className="text-center shadow-bottom">
            Reading History
          </SubHeading>
          <ul>
            {value.readings.map((value) => (
              <ReadingHistoryListItem
                key={`${value.date.toISOString()}-${value.sequence}`}
                value={value}
              />
            ))}
          </ul>
        </div>
      </div>

      <div
        className="flex w-full flex-col items-center gap-y-12 bg-subtle pb-32 pt-16 tablet:pt-8 desktop:gap-y-24"
        data-pagefind-ignore
      >
        <MoreReviews values={moreReviews}>
          <SubHeading as="h2">
            More{" "}
            <a className="text-accent" href={`/reviews/`}>
              Reviews
            </a>
          </SubHeading>
        </MoreReviews>
      </div>
      <StructuredData
        coverImgSrc={structuredDataCoverSrc}
        grade={value.grade}
        title={value.title}
      />
    </Layout>
  );
}

function Authors({
  className,
  values,
}: {
  className: string;
  values: ReviewWithContent["authors"];
}) {
  return (
    <div className={className}>
      by{" "}
      {toSentenceArray(
        values.map((author) => (
          <AuthorLink
            className="inline-block text-accent"
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
  coverImageProps: FixedCoverImageProps;
}) {
  return (
    <div
      className="relative my-12 flex h-[340px] w-full max-w-popout flex-col items-center"
      data-pagefind-meta={`image:${coverImageProps.src}`}
    >
      <div className="cover-clip-path absolute inset-0 overflow-hidden">
        <div
          className={
            "absolute left-[-5%] top-[-5%] size-[110%] bg-default bg-cover bg-center"
          }
          style={{
            backgroundColor: "var(--bg-default)",
            backgroundImage: `linear-gradient(90deg, rgba(var(--bg-default-rgb),1) 0%, rgba(var(--bg-default-rgb),var(--bg-default-alpha)) 30%, rgba(var(--bg-default-rgb),0) 50%, rgba(var(--bg-default-rgb),var(--bg-default-alpha)) 70%, rgba(var(--bg-default-rgb),1) 100%), url(${coverImageProps.src})`,
          }}
        />
        <div className="absolute size-full backdrop-blur" />
      </div>
      <div
        className={`relative -top-4 z-10 h-[372px] ${coverImageProps.hasAlpha ? "" : "shadow-[0_5px_20px_rgba(49,46,42,0.22)]"}`}
      >
        <Cover
          className={`safari-border-radius-fix ${coverImageProps.hasAlpha ? "" : "shadow-[0_5px_20px_rgba(49,46,42,0.22)]"}`}
          decoding="auto"
          height={CoverImageConfig.height}
          imageProps={{
            src: coverImageProps.src,
            srcSet: coverImageProps.srcSet,
          }}
          loading="eager"
          width={CoverImageConfig.width}
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
  return <Grade height={32} value={value} />;
}

function YearAndKind({
  className,
  kind,
  yearPublished,
}: {
  className: string;
  kind: ReviewWithContent["kind"];
  yearPublished: ReviewWithContent["yearPublished"];
}) {
  return (
    <div className={className}>
      <span className="tracking-wide">{yearPublished}</span> | {kind}
    </div>
  );
}
