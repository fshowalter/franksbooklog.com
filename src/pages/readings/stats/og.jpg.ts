import type { APIRoute } from "astro";

import { createOpenGraphImageResponse } from "~/utils/createOpenGraphImageResponse";

/**
 * Astro API endpoint that generates the Open Graph image for the all-time reading statistics page.
 * Creates a JPEG image with the stats backdrop and "All-Time Stats" title for social
 * media sharing when the aggregate statistics page is shared on platforms like Facebook, Twitter, etc.
 *
 * @returns HTTP response containing the generated JPEG image with appropriate content-type headers
 */
export const GET: APIRoute = async function get() {
  return await createOpenGraphImageResponse("All-Time Stats", "stats");
};
