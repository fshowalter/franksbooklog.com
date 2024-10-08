import path from "node:path";

import type { APIRoute, InferGetStaticPropsType } from "astro";
import sharp from "sharp";
import { getOpenGraphCoverAsBase64String } from "src/api/covers";
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

  const jpeg = await componentToImage(
    OpenGraphImage({
      title: work.title,
      authors: work.authors.map((author) => author.name),
      cover: await getOpenGraphCoverAsBase64String(work),
      grade: gradeString,
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
