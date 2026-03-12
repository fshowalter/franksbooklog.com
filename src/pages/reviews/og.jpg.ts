import type { APIRoute } from "astro";

import { reviewsOpenGraphImageResponse } from "~/features/reviews/reviewsOpenGraphImageResponse";

/**
 * Astro API endpoint that generates the Open Graph image for the reviews index page.
 * Creates a JPEG image with the reviews backdrop and "Reviews" title for social
 * media sharing when the reviews listing page is shared on platforms like Facebook, Twitter, etc.
 *
 * @returns HTTP response containing the generated JPEG image with appropriate content-type headers
 */
export const GET: APIRoute = async function get() {
  return await reviewsOpenGraphImageResponse();
};
