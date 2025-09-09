import type { CoverImageProps } from "~/api/covers";
import type { Review, ReviewWithExcerpt } from "~/api/reviews";

import { ReviewCard } from "~/components/review-card/ReviewCard";
import { SubHeading } from "~/components/sub-heading/SubHeading";

/**
 * Image configuration for review cards in "More Reviews" sections.
 * Defines responsive sizing for review cover images with breakpoints
 * optimized for the two-column grid layout.
 */
export const MoreReviewsImageConfig = {
  height: 372,
  sizes:
    "(min-width: 1800px) 218px, (min-width: 1280px) calc(11.8vw + 8px), (min-width: 820px) 216px, (min-width: 600px) calc(23.5vw + 28px), calc(41.43vw + 8px)",
  width: 248,
};

/**
 * Represents the data structure for a review item in "More Reviews" sections.
 * Contains all necessary information to display a review card including
 * metadata, cover image properties, and excerpt content.
 */
export type MoreReviewsValue = {
  /** Array of authors for the reviewed work */
  authors: Author[];
  /** Cover image properties for display */
  coverImageProps: CoverImageProps;
  /** Review excerpt text */
  excerpt: ReviewWithExcerpt["excerpt"];
  /** Grade given to the work */
  grade: Review["grade"];
  /** Type of work (e.g., "Novel", "Short Story") */
  kind: Review["kind"];
  /** Sequence number of the review */
  reviewSequence: Review["reviewSequence"];
  /** URL slug for the review */
  slug: Review["slug"];
  /** Title of the reviewed work */
  title: Review["title"];
  /** Year the work was published */
  workYear: Review["workYear"];
};

/**
 * Author information for display in review cards.
 * Simplified author type containing only display-relevant fields.
 */
type Author = Pick<Review["authors"][0], "name" | "notes"> & {};

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

/**
 * Renders a styled heading for "More Reviews" sections.
 * Creates a heading with accent text and hover effects, linking to
 * a page with more content. Polymorphic component supporting different heading levels.
 *
 * @param props - The component props
 * @param props.accentText - Text to display with accent styling (typically a count)
 * @param props.as - The HTML heading element to render (defaults to "h2")
 * @param props.href - URL to link to when the heading is clicked
 * @param props.text - Main heading text
 * @returns A JSX element containing the styled heading link
 */
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
