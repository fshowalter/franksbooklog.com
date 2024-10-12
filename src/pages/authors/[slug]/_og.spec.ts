import { experimental_AstroContainer as AstroContainer } from "astro/container";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "vitest";

import { allAuthors } from "~/api/authors.ts";

import * as OgEndpoint from "./og.jpg.ts";

const authors = await allAuthors();

const testSlugs = new Set([
  "arnold-schwarzenegger",
  "jesse-itzler",
  "richard-laymon",
]);

const testAuthors = authors.filter((author) => testSlugs.has(author.slug));

describe("/authors/:slug/og.jpg", () => {
  it.for(testAuthors)(
    "matches file",
    { timeout: 40_000 },
    async (author, { expect }) => {
      const container = await AstroContainer.create();

      // @ts-expect-error astro signature is wrong
      const response = await container.renderToResponse(OgEndpoint, {
        props: {
          name: author.name,
          slug: author.slug,
        },
        routeType: "endpoint",
      });

      const result = Buffer.from(await response.arrayBuffer());

      const snapshotFile = path.join(
        import.meta.dirname,
        "__image_snapshots__",
        `${author.slug}-og.jpg`,
      );

      if (!fs.existsSync(snapshotFile)) {
        fs.writeFileSync(snapshotFile, result);
      }

      const snapshot = fs.readFileSync(snapshotFile);

      void expect(result.compare(snapshot)).toBe(0);
    },
  );
});
