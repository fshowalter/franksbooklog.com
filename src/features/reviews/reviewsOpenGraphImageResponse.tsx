import { getOpenGraphBackdrop } from "~/assets/backdrops";
import { OpenGraphImage } from "~/components/open-graph-image/OpenGraphImage";
import { componentToImageResponse } from "~/utils/componentToImageResponse";

export async function reviewsOpenGraphImageResponse(): Promise<Response> {
  const backdrop = await getOpenGraphBackdrop("reviews");

  return await componentToImageResponse(<OpenGraphImage title="Reviews" />, [
    {
      data: backdrop,
      src: "backdrop",
    },
  ]);
}
