import type { APIRoute } from "astro";

import { createHomeOpenGraphImageResponse } from "~/features/home/createHomeOpenGraphImageResponse";

/**
 * Astro API endpoint that generates the Open Graph image for the home page.
 * Creates a JPEG image with the home backdrop and renders it as an HTTP response
 * for social media sharing platforms like Facebook, Twitter, etc.
 *
 * @returns HTTP response containing the generated JPEG image with appropriate content-type headers
 */
export const GET: APIRoute = async function get() {
  return await createHomeOpenGraphImageResponse();
};
