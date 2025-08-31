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
      // Write the CI-generated image for debugging
      const debugFile = path.join(
        import.meta.dirname,
        "__image_snapshots__",
        "og-ci-debug.jpg",
      );
      fs.writeFileSync(debugFile, result);
      
      console.log(`Image comparison failed. Difference: ${comparison}`);
      console.log(`Expected size: ${snapshot.length} bytes`);
      console.log(`Actual size: ${result.length} bytes`);
      console.log(`Debug image written to: ${debugFile}`);
      
      // Also output first few bytes to see if there's a pattern
      console.log(`First 20 bytes of expected:`, snapshot.subarray(0, 20));
      console.log(`First 20 bytes of actual:`, result.subarray(0, 20));
    }

    void expect(comparison).toBe(0);
  });
});
