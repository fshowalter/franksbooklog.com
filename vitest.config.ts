/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    coverage: {
      exclude: [
        "src/**/*.astro",
        "src/assets/**",
        "src/collections/*.ts",
        "src/components/nav-drawer/**",
        "src/components/open-graph-image/**",
        "src/components/pagefind-search/**",
        "src/css",
        "src/features/**/*OpenGraphImageResponse.tsx",
        "src/features/feed/**",
        "src/features/home/**",
        "src/features/how-i-grade/**",
        "src/features/review/**",
        "src/features/stats/**",
        "src/pages/**",
      ],
      include: ["src/**"],
      provider: "v8",
    },
    globals: true, // needed for testing-library teardown
    projects: [
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
    ],
    // Vitest configuration options
    setupFiles: ["setupTests.ts"],
  },
});
