import type { AstroComponentFactory } from "astro/runtime/server/index.js";

import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import * as prettier from "prettier";
import { describe, it } from "vitest";

import { allStatYears } from "~/api/yearStats";
import { normalizeScriptSrc } from "~/utils/normalizeScriptSrc";

import YearStats from "./index.astro";

const statYears = await allStatYears();

describe("/readings/stats/:year", () => {
  it.for(statYears)(
    "matches snapshot for year %i",
    { timeout: 10_000 },
    async (year, { expect }) => {
      const renderers = await loadRenderers([reactContainerRenderer()]);
      const container = await AstroContainer.create({ renderers });
      const result = await container.renderToString(
        YearStats as AstroComponentFactory,
        {
          partial: false,
          props: { year: year },
          request: new Request(
            `https://www.franksbooklog.com/readings/stats/${year}/`,
          ),
        },
      );

      await expect(
        await prettier.format(normalizeScriptSrc(result), {
          filepath: "index.html",
        }),
      ).toMatchFileSnapshot(`__snapshots__/${year}.html`);
    },
  );
});
