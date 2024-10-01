import type { CoverImageProps } from "src/api/covers";
import type { Review } from "src/api/reviews";
import { toSentenceArray } from "src/utils";
import { ccn } from "src/utils/concatClassNames";

import { Cover } from "./Cover";
import { Grade } from "./Grade";

export const MoreReviewsImageConfig = {
  width: 248,
  height: 372,
};

interface Author extends Pick<Review["authors"][0], "name"> {}

export interface MoreReviewsValue {
  slug: Review["slug"];
  coverImageProps: CoverImageProps;
  title: Review["title"];
  yearPublished: Review["yearPublished"];
  grade: Review["grade"];
  kind: Review["kind"];
  authors: Author[];
}

export function MoreReviews({
  values,
  children,
}: {
  values: MoreReviewsValue[];
  children: React.ReactNode;
}): JSX.Element {
  return (
    <nav
      data-pagefind-ignore
      className="relative flex w-full flex-col items-center tablet:w-auto"
    >
      <div className="relative mx-auto w-full max-w-screen-max px-container desktop:px-20">
        {children}
        <ul className="flex flex-wrap justify-center gap-x-[3%] gap-y-[6vw] desktop:justify-between">
          {values.map((value) => {
            return <MoreReviewsCard key={value.slug} value={value} />;
          })}
        </ul>
      </div>
    </nav>
  );
}

export function MoreReviewsCard({
  value,
}: {
  value: MoreReviewsValue;
}): JSX.Element {
  return (
    <li className="relative flex w-[48.5%] max-w-[248px] flex-col items-center border-default bg-default tablet:w-[22.75%]">
      <Cover
        imageProps={value.coverImageProps}
        decoding="async"
        {...MoreReviewsImageConfig}
        alt=""
        loading="lazy"
      />
      <div className="flex grow flex-col items-center px-[8%] pb-8 pt-3 desktop:pl-[8.5%] desktop:pr-[10%]">
        <div className="text-center text-md font-medium leading-6">
          <a
            href={`/reviews/${value.slug}/`}
            rel="canonical"
            className="z-10 inline-block decoration-2 underline-offset-4 before:absolute before:inset-x-0 before:top-0 before:aspect-cover before:bg-[#fff] before:opacity-15 hover:text-accent hover:underline hover:before:opacity-0"
          >
            {value.title}
          </a>
        </div>
        <div className="py-2 text-center font-sans text-xxs font-light uppercase leading-4 tracking-wide text-subtle">
          {value.yearPublished} |{" "}
          <span className="whitespace-nowrap">{value.kind}</span>
        </div>
        <p className="text-center text-base text-subtle">
          by {toSentenceArray(value.authors.map((author) => author.name))}
        </p>{" "}
        <Grade value={value.grade} height={18} className="mt-2" />
      </div>
    </li>
  );
}
