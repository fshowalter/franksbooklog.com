import type { APIRoute, InferGetStaticPropsType } from "astro";

import path from "node:path";
import sharp from "sharp";

import { getOpenGraphCoverAsBase64String } from "~/api/covers";
import { allReviews } from "~/api/reviews";
import { fileForGrade } from "~/components/Grade";
import { OpenGraphImage } from "~/components/Review/OpenGraphImage";
import { componentToImage } from "~/utils/componentToImage";

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

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
      authors: work.authors.map((author) => author.name),
      cover: await getOpenGraphCoverAsBase64String(work),
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
