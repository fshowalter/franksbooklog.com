import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { loadRenderers } from "astro:container";
import * as prettier from "prettier";
import { allStatYears } from "src/api/yearStats";
import { describe, it } from "vitest";

import YearStats from "./index.astro";

const statYears = await allStatYears();

describe("/readings/stats/:year", () => {
  it.for(statYears)(
    "matches snapshot for year %i",
    { timeout: 10000 },
    async (year, { expect }) => {
      const renderers = await loadRenderers([reactContainerRenderer()]);
      const container = await AstroContainer.create({ renderers });
      const result = await container.renderToString(
        YearStats as AstroComponentFactory,
        {
          request: new Request(
            `https://www.franksbooklog.com/readings/stats/${year}/`,
          ),
          props: { year: year },
        },
      );

      void expect(
        await prettier.format(result, { parser: "html" }),
      ).toMatchFileSnapshot(`__snapshots__/${year}.html`);
    },
  );
});