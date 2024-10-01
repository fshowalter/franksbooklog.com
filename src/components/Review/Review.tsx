import type { CoverImageProps } from "src/api/covers";
import type { Review, ReviewWithContent } from "src/api/reviews";
import { AuthorLink } from "src/components/AuthorLink";
import { Cover } from "src/components/Cover";
import { Grade } from "src/components/Grade";
import { LongFormText } from "src/components/LongFormText";
import { PageTitle } from "src/components/PageTitle";
import { toSentenceArray } from "src/utils/";

import { Layout } from "../Layout";
import { SubHeading } from "../SubHeading";
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
    <Layout hasBackdrop={false} className="flex flex-col" data-pagefind-body>
      <header className="mb-12 flex flex-col items-center px-[8%] pt-10">
        <Title title={value.title} subtitle={value.subtitle} />
        <Authors values={value.authors} />
        <YearAndKind yearPublished={value.yearPublished} kind={value.kind} />
        <ReviewCover coverImageProps={coverImageProps} />
        <ReviewGrade value={value.grade} />
        <ReviewDate value={value.date} />
      </header>
      <div className="flex flex-col items-center gap-16 px-container pb-20 desktop:gap-20 desktop:pb-32">
        <LongFormText className="max-w-prose" text={value.content} />
      </div>
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
      <div
        data-pagefind-ignore
        className="flex w-full flex-col items-center gap-y-12 bg-subtle pb-32 pt-16 tablet:pt-8 desktop:gap-y-24"
      >
        <MoreReviews values={moreReviews} />
      </div>
      <StructuredData
        title={value.title}
        grade={value.grade}
        seoImageSrc={seoImageSrc}
      />
    </Layout>
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
        <div className="tracking-1px max-w-prose pt-2 font-normal text-muted">
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
    <div className="tracking-1px uppercase text-subtle">
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
      <div className="tracking-1px text-md uppercase text-emphasis">
        Abandoned
      </div>
    );
  }
  return <Grade value={value} height={32} />;
}

function ReviewDate({ value }: { value: ReviewWithContent["date"] }) {
  return (
    <div className="tracking-0.5px flex flex-col items-center text-subtle">
      <span>on</span> {formatDate(value)}
    </div>
  );
}
