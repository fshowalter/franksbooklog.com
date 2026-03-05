import eslint from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import perfectionist from "eslint-plugin-perfectionist";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import eslintPluginSeparateTypeImports from "eslint-plugin-separate-type-imports";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig } from "eslint/config";
import tsEslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["dist/", ".astro/", "coverage/", "content/", "public/"],
  },
  eslint.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  eslintPluginSeparateTypeImports.configs.recommended,
  reactHooks.configs.flat.recommended,
  perfectionist.configs["recommended-natural"],
  tsEslint.configs.recommendedTypeChecked,
  eslintPluginAstro.configs.recommended,
  {
    rules: {
      "@typescript-eslint/array-type": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": "off", // Turned off in favor of our custom rule
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*"],
              message: "no relative imports outside current folder",
            },
          ],
        },
      ],
      "unicorn/filename-case": "off",
      "unicorn/no-array-reverse": "off",
      "unicorn/no-nested-ternary": "off",
      "unicorn/prevent-abbreviations": "off",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
  },
  {
    files: ["**/*.{astro,tsx}"],
    plugins: {
      "better-tailwindcss": eslintPluginBetterTailwindcss,
    },
    rules: {
      ...eslintPluginBetterTailwindcss.configs["recommended-error"].rules,
      "better-tailwindcss/no-conflicting-classes": "error",
      "better-tailwindcss/no-unknown-classes": [
        "error",
        { detectComponentClasses: true },
      ],
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/css/tailwind.css",
      },
    },
  },
  {
    files: ["**/*.tsx"],
    plugins: {
      react,
    },
    rules: {
      ...react.configs.recommended.rules,
      "@typescript-eslint/explicit-function-return-type": "error",
      "react/boolean-prop-naming": "error",
      "react/button-has-type": "error",
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    extends: [tsEslint.configs.disableTypeChecked],
    ...tsEslint.configs.eslintRecommended,
    files: ["**/*.astro"],
  },
  {
    files: ["src/**/?(*.)+(spec|test).[jt]s?(x)"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
);
