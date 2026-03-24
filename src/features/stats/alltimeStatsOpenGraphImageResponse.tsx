import { getOpenGraphBackdrop } from "~/assets/backdrops";
import { OpenGraphImage } from "~/components/react/open-graph-image/OpenGraphImage";
import { componentToImageResponse } from "~/utils/componentToImageResponse";

export async function alltimeStatsOpenGraphImageResponse(): Promise<Response> {
  const backdrop = await getOpenGraphBackdrop("stats");

  return await componentToImageResponse(
    <OpenGraphImage title="All-Time Stats" />,
    [
      {
        data: backdrop,
        src: "backdrop",
      },
    ],
  );
}
