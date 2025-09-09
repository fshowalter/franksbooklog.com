import type { APIRoute } from "astro";

import { getOpenGraphBackdropAsBase64String } from "~/api/backdrops";
import { OpenGraphImage } from "~/components/open-graph-image/OpenGraphImage";
import { componentToImage } from "~/utils/componentToImage";

/**
 * Astro API endpoint that generates the Open Graph image for the "How I Grade" page.
 * Creates a JPEG image with the grading backdrop and "How I Grade" title for social
 * media sharing when the grading explanation page is shared on platforms like Facebook, Twitter, etc.
 *
 * @returns HTTP response containing the generated JPEG image with appropriate content-type headers
 */
export const GET: APIRoute = async function get() {
  const jpeg = await componentToImage(
    OpenGraphImage({
      backdrop: await getOpenGraphBackdropAsBase64String("how-i-grade"),
      title: "How I Grade",
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
