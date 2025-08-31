import type { CoverImageProps } from "~/api/covers";
import type { Review, ReviewWithExcerpt } from "~/api/reviews";

import { ReviewCardWithExcerpt } from "./ReviewCardWithExcerpt";

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
}): JSX.Element {
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
            return <ReviewCardWithExcerpt key={value.slug} value={value} />;
          })}
        </ol>
      </div>
    </nav>
  );
}
