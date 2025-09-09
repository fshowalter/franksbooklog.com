import type { CoverImageProps } from "~/api/covers";
import type { Review, ReviewWithExcerpt } from "~/api/reviews";

import { ReviewCard } from "~/components/review-card/ReviewCard";
import { SubHeading } from "~/components/sub-heading/SubHeading";

export const MoreReviewsImageConfig = {
  height: 372,
  sizes:
    "(min-width: 1800px) 218px, (min-width: 1280px) calc(11.8vw + 8px), (min-width: 820px) 216px, (min-width: 600px) calc(23.5vw + 28px), calc(41.43vw + 8px)",
  width: 248,
};

export type MoreReviewsValue = {
  authors: Author[];
  coverImageProps: CoverImageProps;
  excerpt: ReviewWithExcerpt["excerpt"];
  grade: Review["grade"];
  kind: Review["kind"];
  reviewSequence: Review["reviewSequence"];
  slug: Review["slug"];
  title: Review["title"];
  workYear: Review["workYear"];
};

type Author = Pick<Review["authors"][0], "name" | "notes"> & {};

export function MoreReviews({
  children,
  values,
}: {
  children: React.ReactNode;
  values: MoreReviewsValue[];
}): React.JSX.Element {
  return (
    <nav
      className={`
        mx-auto w-full max-w-[894px] bg-subtle px-container
        min-[1080px]:max-w-(--breakpoint-desktop)
      `}
      data-page-find-ignore
    >
      <div>{children}</div>
      <div
        className={`
          @container/cover-list mx-auto
          tablet:-mx-6
        `}
      >
        <ol
          className={`
            grid flex-wrap gap-x-8 gap-y-8
            tablet-landscape:grid-cols-2
          `}
        >
          {values.map((value) => {
            return <ReviewCard key={value.slug} value={value} />;
          })}
        </ol>
      </div>
    </nav>
  );
}

export function MoreReviewsHeading({
  accentText,
  as = "h2",
  href,
  text,
}: {
  accentText: string;
  as?: "h2" | "h3" | "h4" | "h5";
  href: string;
  text: string;
}): React.JSX.Element {
  return (
    <SubHeading as={as}>
      <a
        className={`
          relative -mb-1 inline-block transform-gpu pb-1 transition-all
          after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
          after:origin-bottom-right after:scale-x-0 after:bg-accent
          after:transition-transform after:duration-500
          hover:after:scale-x-100
        `}
        href={href}
      >
        {text} <span className={`text-accent`}>{accentText}</span>
      </a>
    </SubHeading>
  );
}
