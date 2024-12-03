import type { AstroComponentFactory } from "astro/runtime/server/index.js";

import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import * as prettier from "prettier";
import { describe, it } from "vitest";

import { normalizeScriptSrc } from "~/utils/nomalizeScriptSrc";

import Index from "./index.astro";

describe("/authors/", () => {
  it("matches snapshot", { timeout: 10_000 }, async ({ expect }) => {
    const renderers = await loadRenderers([reactContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    container.addClientRenderer({
      entrypoint: "@astrojs/react/client.js",
      name: "@astrojs/react",
    });
    const result = await container.renderToString(
      Index as AstroComponentFactory,
      {
        partial: false,
        request: new Request(`https://www.franksbooklog.com/authors/`),
      },
    );

    await expect(
      await prettier.format(normalizeScriptSrc(result), {
        filepath: "index.html",
      }),
    ).toMatchFileSnapshot(`__snapshots__/index.html`);
  });
});
