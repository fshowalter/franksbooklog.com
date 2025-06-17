/* eslint-disable unicorn/no-null */
/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard"],
  overrides: [
    {
      customSyntax: "postcss-html",
      files: [".astro", "**/*.astro"],
    },
  ],
  plugins: ["stylelint-order"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "layer",
          "config",
          "variants",
          "responsive",
          "screen",
        ],
      },
    ],
    "function-no-unknown": [
      true,
      {
        ignoreFunctions: ["theme"],
      },
    ],
    "media-query-no-invalid": [
      true,
      {
        ignoreFunctions: ["screen"],
      },
    ],
    "no-descending-specificity": null,
    "order/order": [["custom-properties", "declarations", "rules", "at-rules"]],
    "order/properties-order": [["all"], { unspecified: "bottomAlphabetical" }],
    "selector-class-pattern": null,
    "selector-id-pattern": null,
  },
};
