/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    coverage: {
      include: ["src/**"],
      provider: "istanbul",
    },
    environmentMatchGlobs: [
      ["src/pages/**", "node"],
      ["src/components/**", "jsdom"],
      // ...
    ],
    globals: true, // needed for testing-library teardown
    // Vitest configuration options
    setupFiles: ["setupTests.ts"],
  },
});
