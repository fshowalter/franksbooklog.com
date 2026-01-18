import type { ReviewCardValue } from "~/components/review-card/ReviewCard";

import { ReviewCard } from "~/components/review-card/ReviewCard";

/**
 * Renders a "More Reviews" section with a grid of review cards.
 * Displays related reviews in a responsive two-column grid layout
 * with proper spacing and container queries for optimal display.
 *
 * @param props - The component props
 * @param props.children - Content to display above the review grid (typically heading)
 * @param props.values - Array of review data to display as cards
 * @returns A JSX element containing the more reviews section
 */
export function MoreReviews({
  children,
  values,
}: {
  children: React.ReactNode;
  values: ReviewCardValue[];
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
            grid flex-wrap gap-8
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
