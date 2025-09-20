import type { MoreReviewsValue } from "~/components/more-reviews/MoreReviews";

import { LongFormText } from "~/components/long-form-text/LongFormText";
import {
  MoreReviews,
  MoreReviewsHeading,
} from "~/components/more-reviews/MoreReviews";

/**
 * Props for the Article page component
 */
export type ArticleProps = {
  content: string | undefined;
  recentReviews: MoreReviewsValue[];
};

/**
 * Article page component for displaying static content with backdrop and recent reviews.
 * Designed for informational pages like "About" or "How I Grade" with long-form content.
 *
 * @param props - Component props
 * @param props.backdropImageProps - Background image properties for the hero section
 * @param props.content - Main article content (HTML string)
 * @param props.deck - Subtitle text for the backdrop
 * @param props.recentReviews - Recent reviews to display in the footer section
 * @param props.title - Main title for the article page
 * @returns Article page component with backdrop, content, and recent reviews
 */
export function Article({
  content,
  recentReviews,
}: ArticleProps): React.JSX.Element {
  return (
    <>
      <section className="flex flex-col items-center pt-16 pb-32">
        <div className="px-container">
          <LongFormText className={`max-w-prose`} text={content} />
        </div>
      </section>
      <div
        className={`
          flex w-full flex-col items-center gap-y-12 bg-subtle pt-16 pb-32
          tablet:pt-8
          desktop:gap-y-24
        `}
        data-pagefind-ignore
      >
        <MoreReviews values={recentReviews}>
          <MoreReviewsHeading
            accentText="Reviews"
            href={`/reviews/`}
            text="Recent"
          />
        </MoreReviews>
      </div>
    </>
  );
}
