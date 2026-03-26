/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    coverage: {
      exclude: [
        "src/assets/**",
        "src/collections/**",
        "src/components/astro/**",
        "src/components/react/open-graph-image/**",
        "src/content.config.ts",
        "src/css",
        "src/features/**/*OpenGraphImageResponse.tsx",
        "src/features/**/get*Props.ts",
        "src/features/feed/**",
        "src/features/home/**",
        "src/features/how-i-grade/**",
        "src/features/review/**",
        "src/features/stats/**",
        "src/pages/**",
      ],
      include: ["src/**/*.{ts,js,tsx}"],
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
    reporters: process.env.GITHUB_ACTIONS ? ["dot", "github-actions"] : ["dot"],
    // Vitest configuration options
    setupFiles: ["setupTests.ts"],
  },
});
