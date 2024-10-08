import eslint from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import eslintPluginAstro from "eslint-plugin-astro";
import react from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tailwind from "eslint-plugin-tailwindcss";
import globals from "globals";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  {
    ignores: ["dist/", ".astro/"],
  },
  eslint.configs.recommended,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [...tsEslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    rules: {
      "@typescript-eslint/array-type": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-empty-object-type": [
        "error",
        {
          allowInterfaces: "with-single-extends",
        },
      ],
    },
  },
  {
    files: ["**/*.astro"],
    extends: [...tailwind.configs["flat/recommended"]],
  },
  {
    files: ["**/*.tsx"],
    extends: [...tailwind.configs["flat/recommended"]],
    plugins: {
      react,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
    },
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
