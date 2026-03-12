import { getOpenGraphBackdrop } from "~/assets/backdrops";
import { OpenGraphImage } from "~/components/open-graph-image/OpenGraphImage";
import { componentToImageResponse } from "~/utils/componentToImageResponse";

export async function yearStatsOpenGraphImageResponse(
  year: string,
): Promise<Response> {
  const backdrop = await getOpenGraphBackdrop("stats");

  return await componentToImageResponse(
    <OpenGraphImage title={`${year} Stats`} />,
    [
      {
        data: backdrop,
        src: "backdrop",
      },
    ],
  );
}
