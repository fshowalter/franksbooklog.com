import type { APIRoute } from "astro";

import { getOpenGraphBackdropAsBase64String } from "~/api/backdrops";
import { HomeOpenGraphImage } from "~/features/home/HomeOpenGraphImage";
import { componentToImage } from "~/utils/componentToImage";

/**
 * Astro API endpoint that generates the Open Graph image for the home page.
 * Creates a JPEG image with the home backdrop and renders it as an HTTP response
 * for social media sharing platforms like Facebook, Twitter, etc.
 *
 * @returns HTTP response containing the generated JPEG image with appropriate content-type headers
 */
export const GET: APIRoute = async function get() {
  const jpeg = await componentToImage(
    HomeOpenGraphImage({
      backdrop: await getOpenGraphBackdropAsBase64String("home"),
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
