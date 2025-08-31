import html from "@html-eslint/eslint-plugin";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import { defineConfig } from "eslint/config";

export default defineConfig(
  {
    ignores: [
      "dist/",
      ".astro/",
      "coverage/",
      "content/",
      "public/",
      "scripts/",
    ],
  },

  {
    files: ["**/*.html"],
    language: "html/html",
    plugins: {
      "better-tailwindcss": eslintPluginBetterTailwindcss,
      html,
    },
    rules: {
      "better-tailwindcss/no-conflicting-classes": "error",
      "better-tailwindcss/no-duplicate-classes": "error",
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/layouts/tailwind.css",
      },
    },
  },
);
