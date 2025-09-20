import type { APIRoute, InferGetStaticPropsType } from "astro";

import { allAuthors } from "~/api/authors";
import { getOpenGraphAvatarAsBase64String } from "~/api/avatars";
import { getOpenGraphBackdropAsBase64String } from "~/api/backdrops";
import { OpenGraphImage } from "~/features/author-titles/OpenGraphImage";
import { componentToImage } from "~/utils/componentToImage";

/**
 * Props type inferred from getStaticPaths function, containing author name and slug
 * for generating individual author Open Graph images.
 */
type Props = InferGetStaticPropsType<typeof getStaticPaths>;

/**
 * Astro static path generation function that creates routes for all author OG images.
 * Generates a static path for each author in the system, enabling pre-built Open Graph
 * images for individual author pages at build time.
 *
 * @returns Array of path objects with params (slug) and props (name, slug) for each author
 */
export async function getStaticPaths() {
  const authors = await allAuthors();

  return authors.map((member) => {
    return {
      params: {
        slug: member.slug,
      },
      props: {
        name: member.name,
        slug: member.slug,
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
  const { name, slug } = props as Props;

  const jpeg = await componentToImage(
    OpenGraphImage({
      avatar: await getOpenGraphAvatarAsBase64String(slug),
      backdrop: await getOpenGraphBackdropAsBase64String("author"),
      name,
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
