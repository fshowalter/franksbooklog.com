import type { AstroComponentFactory } from "astro/runtime/server/index.js";

import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import * as prettier from "prettier";
import { describe, it } from "vitest";

import Page from "./index.astro";

describe("/gone", () => {
  it("matches snapshot", { timeout: 40_000 }, async ({ expect }) => {
    const renderers = await loadRenderers([reactContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const result = await container.renderToString(
      Page as AstroComponentFactory,
      {
        partial: false,
        request: new Request(`https://www.franksbooklog.com/gone/`),
      },
    );

    await expect(
      await prettier.format(result, { filepath: "index.html" }),
    ).toMatchFileSnapshot(`__snapshots__/index.html`);
  });
});
