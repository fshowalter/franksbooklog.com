import type { AstroComponentFactory } from "astro/runtime/server/index.js";

import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import * as prettier from "prettier";
import { describe, it } from "vitest";

import { allReviews } from "~/api/reviews";

import Review from "./index.astro";

const { reviews } = await allReviews();

describe("/reviews/:slug", () => {
  it.for(reviews)(
    "matches snapshot for slug $slug",
    { timeout: 10000 },
    async (review, { expect }) => {
      const renderers = await loadRenderers([reactContainerRenderer()]);
      const container = await AstroContainer.create({ renderers });
      const result = await container.renderToString(
        Review as AstroComponentFactory,
        {
          props: { slug: review.slug },
          request: new Request(
            `https://www.franksbooklog.com/reviews/${review.slug}/`,
          ),
        },
      );

      void expect(
        await prettier.format(result, { parser: "html" }),
      ).toMatchFileSnapshot(`__snapshots__/${review.slug}.html`);
    },
  );
});
