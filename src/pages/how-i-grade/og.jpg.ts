import type { APIRoute } from "astro";

import { howIGradeOpenGraphImageResponse } from "~/features/how-i-grade/howIGradeOpenGraphImageResponse";

/**
 * Astro API endpoint that generates the Open Graph image for the "How I Grade" page.
 * Creates a JPEG image with the grading backdrop and "How I Grade" title for social
 * media sharing when the grading explanation page is shared on platforms like Facebook, Twitter, etc.
 *
 * @returns HTTP response containing the generated JPEG image with appropriate content-type headers
 */
export const GET: APIRoute = async function get() {
  return await howIGradeOpenGraphImageResponse();
};
