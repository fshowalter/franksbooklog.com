import type { APIRoute, InferGetStaticPropsType } from "astro";

import { getCollection } from "astro:content";

import { createReviewOpenGraphImageResponse } from "~/features/review/createReviewOpenGraphImageResponse";

/**
 * Props type inferred from getStaticPaths function, containing the complete review/work data
 * for generating individual review Open Graph images with book covers and grades.
 */
type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function getStaticPaths() {
  const reviewedTitles = await getCollection("reviewedTitles");

  return reviewedTitles.map(({ data: reviewedTitle }) => {
    return {
      params: {
        slug: reviewedTitle.review.id,
      },
      props: {
        reviewedTitle,
      },
    };
  });
}

/**
 * Astro API endpoint that generates personalized Open Graph images for individual book reviews.
 * Creates a JPEG image featuring the book cover, title, authors, and grade badge. Handles
 * dynamic cover sizing and grade image processing using Sharp for optimal social media display.
 * The generated image is used when individual review pages are shared on platforms like Facebook, Twitter, etc.
 *
 * Image processing features:
 * - Dynamically resizes book covers to fit within optimal dimensions (max 500px width, 630px height)
 * - Processes grade badges from SVG files into PNG format for embedding
 * - Converts cover images to base64 data URIs for React component rendering
 * - Maintains aspect ratios while ensuring consistent layout
 *
 * @param context - Astro API context object
 * @param context.props - Review props containing complete work/review data from getStaticPaths
 * @returns HTTP response containing the generated JPEG image with appropriate content-type headers
 */
export const GET: APIRoute = async function get({ props }) {
  const { reviewedTitle } = props as Props;

  return await createReviewOpenGraphImageResponse({
    authors: reviewedTitle.authors,
    coverSlug: reviewedTitle.review.id,
    grade: reviewedTitle.grade,
    title: reviewedTitle.title,
  });
};
