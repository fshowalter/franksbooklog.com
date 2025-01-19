import { experimental_AstroContainer as AstroContainer } from "astro/container";
import * as prettier from "prettier";
import { describe, it } from "vitest";

import * as UpdatesEndpoint from "./updates.json.ts";

describe("/updates.json", () => {
  it("matches snapshot", { timeout: 40_000 }, async ({ expect }) => {
    const container = await AstroContainer.create();

    // @ts-expect-error astro signature is wrong
    const response = await container.renderToResponse(UpdatesEndpoint, {
      routeType: "endpoint",
    });

    const result = await response.text();

    await expect(
      await prettier.format(result, {
        parser: "json",
      }),
    ).toMatchFileSnapshot(`__snapshots__/updates.json`);
  });
});
