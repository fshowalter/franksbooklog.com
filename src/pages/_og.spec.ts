import { experimental_AstroContainer as AstroContainer } from "astro/container";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "vitest";

import * as OgEndpoint from "./og.jpg.ts";

describe("/og.jpg", () => {
  it("matches file", { timeout: 40_000 }, async ({ expect }) => {
    const container = await AstroContainer.create();

    // @ts-expect-error astro signature is wrong
    const response = await container.renderToResponse(OgEndpoint, {
      routeType: "endpoint",
    });

    const result = Buffer.from(await response.arrayBuffer());

    const snapshotFile = path.join(
      import.meta.dirname,
      "__image_snapshots__",
      "og.jpg",
    );

    if (!fs.existsSync(snapshotFile)) {
      fs.writeFileSync(snapshotFile, result);
    }

    const snapshot = fs.readFileSync(snapshotFile);

    const comparison = result.compare(snapshot);
    if (comparison !== 0) {
      console.log(`Image comparison failed. Difference: ${comparison}`);
      console.log(`Expected size: ${snapshot.length} bytes`);
      console.log(`Actual size: ${result.length} bytes`);
      console.log(`Platform: ${process.platform}`);
      console.log(`Node version: ${process.version}`);
      
      // Check if running in CI
      console.log(`CI environment: ${process.env.CI || 'false'}`);
      
      // Output hash of the images to see if they're completely different
      const crypto = await import('crypto');
      const expectedHash = crypto.createHash('md5').update(snapshot).digest('hex');
      const actualHash = crypto.createHash('md5').update(result).digest('hex');
      console.log(`Expected MD5: ${expectedHash}`);
      console.log(`Actual MD5: ${actualHash}`);
    }

    void expect(comparison).toBe(0);
  });
});
