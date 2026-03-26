import type { APIRoute } from "astro";

import { createOpenGraphImageResponse } from "~/utils/createOpenGraphImageResponse";

/**
 * Astro API endpoint that generates the Open Graph image for the authors index page.
 * Creates a JPEG image with the authors backdrop and "Authors" title for social
 * media sharing when the authors page is shared on platforms like Facebook, Twitter, etc.
 *
 * @returns HTTP response containing the generated JPEG image with appropriate content-type headers
 */
export const GET: APIRoute = async function get() {
  return await createOpenGraphImageResponse("Authors", "authors");
};
