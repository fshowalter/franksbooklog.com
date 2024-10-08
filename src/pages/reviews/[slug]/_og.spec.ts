import fs from "node:fs";
import path from "node:path";

import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { allReviews } from "src/api/reviews.ts";
import { describe, it } from "vitest";

import * as OgEndpoint from "./og.jpg.ts";

const { reviews } = await allReviews();
const testSlugs = new Set([
  "the-skeptics-guide-to-the-universe-by-steven-novella",
  "extreme-ownership-by-jocko-willink-leif-babin",
  "roadside-pickup-by-richard-laymon",
  "altar-by-philip-fracassi",
  "living-with-a-seal-by-jesse-itzler",
]);

const testReviews = reviews.filter((review) => {
  return testSlugs.has(review.slug);
});

describe("/reviews/:slug/og.jpg", () => {
  it.for(testReviews)(
    "matches file",
    { timeout: 40000 },
    async (review, { expect }) => {
      const container = await AstroContainer.create();

      // @ts-expect-error astro signature is wrong
      const response = await container.renderToResponse(OgEndpoint, {
        routeType: "endpoint",
        props: {
          work: review,
        },
      });

      const result = Buffer.from(await response.arrayBuffer());

      const snapshotFile = path.join(
        __dirname,
        "__image_snapshots__",
        `${review.slug}-og.jpg`,
      );

      if (!fs.existsSync(snapshotFile)) {
        fs.writeFileSync(snapshotFile, result);
      }

      const snapshot = fs.readFileSync(snapshotFile);

      void expect(result.compare(snapshot)).toBe(0);
    },
  );
});
