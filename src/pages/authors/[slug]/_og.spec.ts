import fs from "node:fs";
import path from "node:path";

import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { allAuthors } from "src/api/authors.ts";
import { describe, it } from "vitest";

import * as OgEndpoint from "./og.jpg.ts";

const authors = await allAuthors();

const testSlugs = ["jesse-itzler", "arnold-schwarzenegger", "richard-laymon"];

const testAuthors = authors.filter((author) => testSlugs.includes(author.slug));

describe("/reviews/:slug/og.jpg", () => {
  it.for(testAuthors)(
    "matches file",
    { timeout: 40000 },
    async (author, { expect }) => {
      const container = await AstroContainer.create();

      // @ts-expect-error astro signature is wrong
      const response = await container.renderToResponse(OgEndpoint, {
        routeType: "endpoint",
        props: {
          slug: author.slug,
          name: author.name,
        },
      });

      const result = Buffer.from(await response.arrayBuffer());

      const snapshotFile = path.join(
        __dirname,
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
