import type { APIRoute, InferGetStaticPropsType } from "astro";

import { getCollection } from "astro:content";
import path from "node:path";
import sharp from "sharp";

import {
  getCoverHeight,
  getOpenGraphCoverAsBase64String,
  getWorkCoverPath,
} from "~/assets/covers";
import { getCoverWidth } from "~/assets/covers";
import { fileForGrade } from "~/components/grade/fileForGrade";
import { ReviewOpenGraphImage } from "~/features/review/ReviewOpenGraphImage";
import { componentToImage } from "~/utils/componentToImage";

/**
 * Props type inferred from getStaticPaths function, containing the complete review/work data
 * for generating individual review Open Graph images with book covers and grades.
 */
type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function getStaticPaths() {
  const reviewedWorks = await getCollection("reviewedWorks");

  return reviewedWorks.map(({ data: reviewedWork }) => {
    return {
      params: {
        slug: reviewedWork.review.id,
      },
      props: {
        reviewedWork: reviewedWork,
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
  const { reviewedWork } = props as Props;

  let gradeString;

  const gradeFile = fileForGrade(reviewedWork.grade);

  if (gradeFile) {
    const gradeBuffer = await sharp(
      path.resolve(`./public${fileForGrade(reviewedWork.grade)}`),
    )
      .resize(240)
      .toFormat("png")
      .toBuffer();

    gradeString = `data:${"image/png"};base64,${gradeBuffer.toString("base64")}`;
  }

  let coverHeight = 630;
  let coverWidth = await getCoverWidth(
    { slug: reviewedWork.review.id },
    coverHeight,
  );

  if (coverWidth > 500) {
    const workCoverPath = getWorkCoverPath({ slug: reviewedWork.review.id });
    coverHeight = await getCoverHeight(workCoverPath, 500);
    coverWidth = 500;
  }

  const jpeg = await componentToImage(
    ReviewOpenGraphImage({
      authors: reviewedWork.authors,
      coverBase64DataUri: await getOpenGraphCoverAsBase64String({
        slug: reviewedWork.review.id,
      }),
      coverHeight,
      coverWidth,
      grade: gradeString,
      title: reviewedWork.title,
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
