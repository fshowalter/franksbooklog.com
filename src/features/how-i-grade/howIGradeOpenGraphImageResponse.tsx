import { getOpenGraphBackdrop } from "~/assets/backdrops";
import { OpenGraphImage } from "~/components/react/open-graph-image/OpenGraphImage";
import { componentToImageResponse } from "~/utils/componentToImageResponse";

export async function howIGradeOpenGraphImageResponse(): Promise<Response> {
  const backdrop = await getOpenGraphBackdrop("how-i-grade");

  return await componentToImageResponse(
    <OpenGraphImage title="How I Grade" />,
    [
      {
        data: backdrop,
        src: "backdrop",
      },
    ],
  );
}
