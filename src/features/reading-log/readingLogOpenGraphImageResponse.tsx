import { getOpenGraphBackdrop } from "~/assets/backdrops";
import { OpenGraphImage } from "~/components/open-graph-image/OpenGraphImage";
import { componentToImageResponse } from "~/utils/componentToImageResponse";

export async function readingLogOpenGraphImageResponse(): Promise<Response> {
  const backdrop = await getOpenGraphBackdrop("readings");

  return await componentToImageResponse(
    <OpenGraphImage title="Reading Log" />,
    [
      {
        data: backdrop,
        src: "backdrop",
      },
    ],
  );
}
