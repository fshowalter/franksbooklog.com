import path from "node:path";

import type { APIRoute, InferGetStaticPropsType } from "astro";
import sharp from "sharp";
import { getOpenGraphBackdropAsBase64String } from "src/api/covers";
import { allReviews } from "src/api/reviews";
import { fileForGrade } from "src/components/Grade";
import { OpenGraphImage } from "src/components/Review/OpenGraphImage";
import { componentToImage } from "src/utils/componentToImage";

export async function getStaticPaths() {
  const { reviews } = await allReviews();

  return reviews.map((review) => {
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

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute = async function get({ props }) {
  const { work } = props as Props;

  const gradeBuffer = await sharp(
    path.resolve(`./public${fileForGrade(work.grade)}`),
  )
    .resize(240)
    .toFormat("png")
    .toBuffer();

  const jpeg = await componentToImage(
    OpenGraphImage({
      title: work.title,
      authors: work.authors.map((author) => author.name),
      backdrop: await getOpenGraphBackdropAsBase64String(work),
      grade: `data:${"image/png"};base64,${gradeBuffer.toString("base64")}`,
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
