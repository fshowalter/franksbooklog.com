import type { CoverImageProps } from "src/api/covers";
import type { Review, ReviewWithContent } from "src/api/reviews";
import { AuthorLink } from "src/components/AuthorLink";
import { Cover } from "src/components/Cover";
import { Grade } from "src/components/Grade";
import { LongFormText } from "src/components/LongFormText";
import { PageTitle } from "src/components/PageTitle";
import { toSentenceArray } from "src/utils/";

import { IncludedWorks } from "./IncludedWorks";
import { MoreReviews } from "./MoreReviews";
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
    <main
      data-pagefind-body
      id="top"
      className="flex flex-col items-center pt-6 desktop:pt-12"
    >
      <header className="flex w-full flex-col items-center px-pageMargin">
        <Title title={value.title} subtitle={value.subtitle} />
        <div className="spacer-y-2" />
        <Authors values={value.authors} />
        <div className="spacer-y-2 desktop:spacer-y-4" />
        <YearAndKind yearPublished={value.yearPublished} kind={value.kind} />
        <div className="spacer-y-8" />
        <ReviewCover coverImageProps={coverImageProps} />
        <div className="spacer-y-12" />
        <ReviewGrade value={value.grade} />
        <ReviewDate value={value.date} />
        <div className="spacer-y-8" />
      </header>
      <div className="flex flex-col px-pageMargin desktop:px-gutter">
        <LongFormText className="max-w-prose" text={value.content} />
      </div>
      {value.includedWorks.length > 0 && (
        <div className="w-full max-w-popout">
          <div className="spacer-y-16" />
          <IncludedWorks values={value.includedWorks} />
        </div>
      )}
      <div className="spacer-y-20" />
      <div className="w-full max-w-popout">
        <h2 className="px-gutter text-md font-normal text-subtle shadow-bottom">
          Reading History
          <div className="spacer-y-2" />
        </h2>
        <ul>
          {value.readings.map((value) => (
            <ReadingHistoryListItem key={value.sequence} value={value} />
          ))}
        </ul>
      </div>
      <div className="spacer-y-32" />
      <div
        data-pagefind-ignore
        className="flex w-full flex-col items-center gap-y-12 bg-default tablet:bg-subtle tablet:pb-32 tablet:pt-8 desktop:gap-y-24"
      >
        <MoreReviews values={moreReviews} />
      </div>
      <StructuredData
        title={value.title}
        grade={value.grade}
        seoImageSrc={seoImageSrc}
      />
    </main>
  );
}

function Title({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string | null;
}) {
  return (
    <div className="text-center">
      <PageTitle>{title}</PageTitle>
      {subtitle && (
        <div className="max-w-prose pt-2 font-normal tracking-1px text-muted">
          {subtitle}
        </div>
      )}
    </div>
  );
}

function YearAndKind({
  yearPublished,
  kind,
}: {
  yearPublished: ReviewWithContent["yearPublished"];
  kind: ReviewWithContent["kind"];
}) {
  return (
    <div className="uppercase tracking-1px text-subtle">
      <span className="tracking-0.25px">{yearPublished}</span> | {kind}
    </div>
  );
}

function Authors({ values }: { values: ReviewWithContent["authors"] }) {
  return (
    <div className="text-center text-md text-muted">
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
      className="relative flex h-[340px] w-full max-w-popout flex-col items-center"
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
      <div className="text-md uppercase tracking-1px text-emphasis">
        Abandoned
      </div>
    );
  }
  return <Grade value={value} height={32} />;
}

function ReviewDate({ value }: { value: ReviewWithContent["date"] }) {
  return (
    <div className="flex flex-col items-center tracking-0.5px text-subtle">
      <span>on</span> {formatDate(value)}
    </div>
  );
}
