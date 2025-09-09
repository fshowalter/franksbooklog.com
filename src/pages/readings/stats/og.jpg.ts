import type { APIRoute } from "astro";

import { getOpenGraphBackdropAsBase64String } from "~/api/backdrops";
import { OpenGraphImage } from "~/components/open-graph-image/OpenGraphImage";
import { componentToImage } from "~/utils/componentToImage";

/**
 * Astro API endpoint that generates the Open Graph image for the all-time reading statistics page.
 * Creates a JPEG image with the stats backdrop and "All-Time Stats" title for social
 * media sharing when the aggregate statistics page is shared on platforms like Facebook, Twitter, etc.
 * 
 * @returns {Promise<Response>} HTTP response containing the generated JPEG image with appropriate content-type headers
 */
export const GET: APIRoute = async function get() {
  const jpeg = await componentToImage(
    OpenGraphImage({
      backdrop: await getOpenGraphBackdropAsBase64String("stats"),
      title: "All-Time Stats",
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
