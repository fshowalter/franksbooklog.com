import type { APIRoute, InferGetStaticPropsType } from "astro";

import { getCollection } from "astro:content";
import path from "node:path";
import sharp from "sharp";

import {
  getCoverHeight,
  getOpenGraphCoverAsBase64String,
  getWorkCoverPath,
} from "~/api/covers";
import { getCoverWidth } from "~/api/covers";
import { allReviews } from "~/api/reviews";
import { fileForGrade } from "~/components/grade/fileForGrade";
import { ReviewOpenGraphImage } from "~/features/review/ReviewOpenGraphImage";
import { componentToImage } from "~/utils/componentToImage";

/**
 * Props type inferred from getStaticPaths function, containing the complete review/work data
 * for generating individual review Open Graph images with book covers and grades.
 */
type Props = InferGetStaticPropsType<typeof getStaticPaths>;

/**
 * Astro static path generation function that creates routes for all individual review OG images.
 * Generates a static path for each review in the system, enabling pre-built Open Graph images
 * with book covers, titles, authors, and grade information at build time.
 *
 * @returns Array of path objects with params (slug) and props (work data) for each review
 */
export async function getStaticPaths() {
  const [worksEntries, reviewsEntries, authorsEntries, readingsEntries] =
    await Promise.all([
      getCollection("works"),
      getCollection("reviews"),
      getCollection("authors"),
      getCollection("readings"),
    ]);
  const works = worksEntries.map((e) => e.data);
  const reviews = reviewsEntries.map((e) => e.data);
  const authors = authorsEntries.map((e) => e.data);
  const readings = readingsEntries.map((e) => e.data);
  const { reviews: allReviewsList } = allReviews(works, reviews, authors, readings);

  return allReviewsList.map((review) => {
    return {
      params: {
        slug: review.slug,
      },
      props: {
        work: review,
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
  const { work } = props as Props;

  let gradeString;

  const gradeFile = fileForGrade(work.grade);

  if (gradeFile) {
    const gradeBuffer = await sharp(
      path.resolve(`./public${fileForGrade(work.grade)}`),
    )
      .resize(240)
      .toFormat("png")
      .toBuffer();

    gradeString = `data:${"image/png"};base64,${gradeBuffer.toString("base64")}`;
  }

  let coverHeight = 630;
  let coverWidth = await getCoverWidth(work, coverHeight);

  if (coverWidth > 500) {
    const workCoverPath = getWorkCoverPath(work);
    coverHeight = await getCoverHeight(workCoverPath, 500);
    coverWidth = 500;
  }

  const jpeg = await componentToImage(
    ReviewOpenGraphImage({
      authors: work.authors.map((author) => author.name),
      coverBase64DataUri: await getOpenGraphCoverAsBase64String(work),
      coverHeight,
      coverWidth,
      grade: gradeString,
      title: work.title,
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
