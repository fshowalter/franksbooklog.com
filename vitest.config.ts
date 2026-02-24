/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    coverage: {
      include: ["src/**"],
      provider: "istanbul",
    },
    globals: true, // needed for testing-library teardown
    projects: [
      {
        extends: true,
        test: {
          environment: "node",
          include: ["src/api/**/*.spec.ts"],
          name: "api-node",
          setupFiles: ["setupTests.ts"],
        },
      },
      {
        extends: true,
        test: {
          environment: "node",
          include: ["src/pages/**/*.spec.ts"],
          name: "pages-node",
          setupFiles: ["setupTests.ts"],
        },
      },
      {
        extends: true,
        test: {
          environment: "node",
          include: ["src/components/**/*.spec.ts"],
          name: "components-node",
        },
      },
      {
        extends: true,
        test: {
          environment: "jsdom",
          include: ["src/components/**/*.spec.tsx"],
          name: "components-jsdom",
        },
      },
      {
        extends: true,
        test: {
          environment: "node",
          include: ["src/features/**/*.spec.ts"],
          name: "features-node",
        },
      },
      {
        extends: true,
        test: {
          environment: "jsdom",
          include: ["src/features/**/*.spec.tsx"],
          name: "features-jsdom",
        },
      },
      {
        extends: true,
        test: {
          environment: "node",
          include: ["src/astro/**/*.spec.ts"],
          name: "astro-node",
        },
      },
      {
        extends: true,
        test: {
          environment: "node",
          include: ["src/utils/**/*.spec.ts"],
          name: "utils-node",
          setupFiles: ["setupTests.ts"],
        },
      },
    ],
    // Vitest configuration options
    setupFiles: ["setupTests.ts"],
  },
});
