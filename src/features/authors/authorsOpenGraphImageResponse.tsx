import { getOpenGraphBackdrop } from "~/assets/backdrops";
import { OpenGraphImage } from "~/components/open-graph-image/OpenGraphImage";
import { componentToImageResponse } from "~/utils/componentToImageResponse";

export async function authorsOpenGraphImageResponse(): Promise<Response> {
  const backdrop = await getOpenGraphBackdrop("authors");

  return await componentToImageResponse(<OpenGraphImage title="Authors" />, [
    {
      data: backdrop,
      src: "backdrop",
    },
  ]);
}
