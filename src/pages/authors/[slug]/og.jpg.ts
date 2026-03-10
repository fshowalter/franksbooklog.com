import type { APIRoute, InferGetStaticPropsType } from "astro";

import { getCollection } from "astro:content";

import { getOpenGraphAvatarAsBase64String } from "~/api/avatars";
import { getOpenGraphBackdropAsBase64String } from "~/api/backdrops";
import { AuthorTitlesOpenGraphImage } from "~/features/author-titles/AuthorTitlesOpenGraphImage";
import { componentToImage } from "~/utils/componentToImage";

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function getStaticPaths() {
  const reviewedAuthors = await getCollection("reviewedAuthors");

  return reviewedAuthors.map(({ data: reviewedAuthor }) => {
    return {
      params: {
        slug: reviewedAuthor.slug,
      },
      props: {
        reviewedAuthor,
      },
    };
  });
}

/**
 * Astro API endpoint that generates personalized Open Graph images for individual authors.
 * Creates a JPEG image featuring the author's avatar, name, and custom backdrop for social
 * media sharing when author pages are shared on platforms like Facebook, Twitter, etc.
 *
 * @param context - Astro API context object
 * @param context.props - Author props containing name and slug from getStaticPaths
 * @returns HTTP response containing the generated JPEG image with appropriate content-type headers
 */
export const GET: APIRoute = async function get({ props }) {
  const { reviewedAuthor } = props as Props;

  const jpeg = await componentToImage(
    AuthorTitlesOpenGraphImage({
      avatar: await getOpenGraphAvatarAsBase64String(reviewedAuthor.slug),
      backdrop: await getOpenGraphBackdropAsBase64String("author"),
      name: reviewedAuthor.name,
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
