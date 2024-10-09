import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { loadRenderers } from "astro:container";
import * as prettier from "prettier";
import { allAuthors } from "src/api/authors";
import { describe, it } from "vitest";

import Review from "./index.astro";

const authors = await allAuthors();

const testSlugs = [
  "jesse-itzler",
  "arnold-schwarzenegger",
  "richard-laymon",
  "stephen-king",
];

const testAuthors = authors.filter((author) => testSlugs.includes(author.slug));

describe("/authors/:slug", () => {
  it.for(testAuthors)(
    "matches snapshot for slug $slug",
    { timeout: 10000 },
    async (author, { expect }) => {
      const renderers = await loadRenderers([reactContainerRenderer()]);
      const container = await AstroContainer.create({ renderers });
      container.addClientRenderer({
        name: "@astrojs/react",
        entrypoint: "@astrojs/react/client.js",
      });

      const result = await container.renderToString(
        Review as AstroComponentFactory,
        {
          request: new Request(
            `https://www.franksbooklog.com/authors/${author.slug}/`,
          ),
          props: { slug: author.slug },
        },
      );

      void expect(
        await prettier.format(result, { parser: "html" }),
      ).toMatchFileSnapshot(`__snapshots__/${author.slug}.html`);
    },
  );
});
