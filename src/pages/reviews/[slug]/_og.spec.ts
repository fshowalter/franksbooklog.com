import { experimental_AstroContainer as AstroContainer } from "astro/container";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "vitest";

import { allReviews } from "~/api/reviews.ts";

import * as OgEndpoint from "./og.jpg.ts";

const { reviews } = await allReviews();
const testSlugs = new Set([
  "altar-by-philip-fracassi",
  "extreme-ownership-by-jocko-willink-leif-babin",
  "living-with-a-seal-by-jesse-itzler",
  "roadside-pickup-by-richard-laymon",
  "the-skeptics-guide-to-the-universe-by-steven-novella",
]);

const testReviews = reviews.filter((review) => {
  return testSlugs.has(review.slug);
});

describe("/reviews/:slug/og.jpg", () => {
  it.for(testReviews)(
    "matches file",
    { timeout: 40_000 },
    async (review, { expect }) => {
      const container = await AstroContainer.create();

      // @ts-expect-error astro signature is wrong
      const response = await container.renderToResponse(OgEndpoint, {
        props: {
          work: review,
        },
        routeType: "endpoint",
      });

      const result = Buffer.from(await response.arrayBuffer());

      const snapshotFile = path.join(
        import.meta.dirname,
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
