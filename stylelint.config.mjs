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
        ignoreAtRules: ["theme", "layer", "utility", "component"],
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
        ignoreFunctions: ["theme"],
      },
    ],
    "import-notation": null,
    "custom-property-pattern": null,
    "custom-property-empty-line-before": null,
    "no-descending-specificity": null,
    "order/order": [["custom-properties", "declarations", "rules", "at-rules"]],
    "order/properties-order": [["all"], { unspecified: "bottomAlphabetical" }],
    "selector-class-pattern": null,
    "selector-id-pattern": null,
  },
};
