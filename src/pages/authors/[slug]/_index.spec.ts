import type { AstroComponentFactory } from "astro/runtime/server/index.js";

import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import * as prettier from "prettier";
import { describe, it } from "vitest";

import { allAuthors } from "~/api/authors";

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
        entrypoint: "@astrojs/react/client.js",
        name: "@astrojs/react",
      });

      const result = await container.renderToString(
        Review as AstroComponentFactory,
        {
          props: { slug: author.slug },
          request: new Request(
            `https://www.franksbooklog.com/authors/${author.slug}/`,
          ),
        },
      );

      void expect(
        await prettier.format(result, { parser: "html" }),
      ).toMatchFileSnapshot(`__snapshots__/${author.slug}.html`);
    },
  );
});
