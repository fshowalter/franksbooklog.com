import type { APIRoute } from "astro";
import { OpenGraphImage } from "src/components/OpenGraphImage";
import { componentToImage } from "src/utils/componentToImage";

export const GET: APIRoute = async function get() {
  const jpeg = await componentToImage(
    OpenGraphImage({
      title: "404: Not Found",
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};