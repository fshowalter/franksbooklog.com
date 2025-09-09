import type { APIRoute } from "astro";
import type { InferGetStaticPropsType } from "astro";

import { getOpenGraphBackdropAsBase64String } from "~/api/backdrops";
import { allStatYears } from "~/api/stats";
import { OpenGraphImage } from "~/components/open-graph-image/OpenGraphImage";
import { componentToImage } from "~/utils/componentToImage";

/**
 * Props type inferred from getStaticPaths function, containing the year
 * for generating yearly reading statistics Open Graph images.
 */
type Props = InferGetStaticPropsType<typeof getStaticPaths>;

/**
 * Astro static path generation function that creates routes for yearly reading statistics OG images.
 * Generates a static path for each year that has reading statistics data, enabling pre-built
 * Open Graph images for individual yearly stats pages at build time.
 * 
 * @returns {Promise<Array>} Array of path objects with params (year) and props (year) for each statistics year
 */
export async function getStaticPaths() {
  const statYears = await allStatYears();

  return statYears.map((year) => {
    return {
      params: {
        year: year,
      },
      props: {
        year: year,
      },
    };
  });
}

/**
 * Astro API endpoint that generates personalized Open Graph images for yearly reading statistics.
 * Creates a JPEG image featuring the specific year and stats backdrop for social media sharing
 * when individual year statistics pages are shared on platforms like Facebook, Twitter, etc.
 * 
 * @param {Object} context - Astro API context object
 * @param {Props} context.props - Year props containing the year from getStaticPaths
 * @returns {Promise<Response>} HTTP response containing the generated JPEG image with appropriate content-type headers
 */
export const GET: APIRoute = async function get({ props }) {
  const { year } = props as Props;

  const jpeg = await componentToImage(
    OpenGraphImage({
      backdrop: await getOpenGraphBackdropAsBase64String("stats"),
      title: `${year} Stats`,
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
