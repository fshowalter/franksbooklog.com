import type { APIRoute } from "astro";

import { createOpenGraphImageResponse } from "~/utils/createOpenGraphImageResponse";

/**
 * Astro API endpoint that generates the Open Graph image for the reading log page.
 * Creates a JPEG image with the readings backdrop and "Reading Log" title for social
 * media sharing when the reading log page is shared on platforms like Facebook, Twitter, etc.
 *
 * @returns HTTP response containing the generated JPEG image with appropriate content-type headers
 */
export const GET: APIRoute = async function get() {
  return await createOpenGraphImageResponse("Reading Log", "readings");
};
