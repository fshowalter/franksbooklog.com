import fs from "node:fs";
import path from "node:path";

import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { allStatYears } from "src/api/yearStats.ts";
import { describe, it } from "vitest";

import * as OgEndpoint from "./og.jpg.ts";

const statYears = await allStatYears();

describe("/readings/stats/:year/og.jpg", () => {
  it.for(statYears)(
    "matches file",
    { timeout: 40000 },
    async (year, { expect }) => {
      const container = await AstroContainer.create();

      // @ts-expect-error astro signature is wrong
      const response = await container.renderToResponse(OgEndpoint, {
        routeType: "endpoint",
        props: {
          year,
        },
      });

      const result = Buffer.from(await response.arrayBuffer());

      const snapshotFile = path.join(
        __dirname,
        "__image_snapshots__",
        `${year}-og.jpg`,
      );

      if (!fs.existsSync(snapshotFile)) {
        fs.writeFileSync(snapshotFile, result);
      }

      const snapshot = fs.readFileSync(snapshotFile);

      void expect(result.compare(snapshot)).toBe(0);
    },
  );
});