import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import { createIndex } from "pagefind";
import sirv from "sirv";

function contentHmr() {
  return {
    name: "content-hmr",
    enforce: "post",
    // HMR
    handleHotUpdate({ file, server }) {
      console.log(file);
      if (file.includes("/content/")) {
        console.log("reloading content file...");
        server.ws.send({
          type: "full-reload",
          path: "*",
        });
      }
    },
  };
}

function pagefind() {
  let outDir;
  let assets;
  return {
    name: "pagefind",
    hooks: {
      "astro:config:setup": ({ config }) => {
        outDir = fileURLToPath(config.outDir);

        if (config.build.assetsPrefix) {
          assets = null;
        } else {
          assets = config.build.assets;
        }
      },
      "astro:server:setup": ({ server, logger }) => {
        if (!outDir) {
          logger.warn(
            "astro-pagefind couldn't reliably determine the output directory. Search assets will not be served.",
          );
          return;
        }
        const serve = sirv(outDir, {
          dev: true,
          etag: true,
        });
        server.middlewares.use((req, res, next) => {
          if (
            req.url?.startsWith("/pagefind/") ||
            (assets && req.url?.startsWith(`/${assets}/`))
          ) {
            serve(req, res, next);
          } else {
            next();
          }
        });
      },
      "astro:build:done": async ({ logger }) => {
        if (!outDir) {
          logger.warn(
            "astro-pagefind couldn't reliably determine the output directory. Search index will not be built.",
          );
          return;
        }

        const { index, errors: createErrors } = await createIndex({});
        if (!index) {
          logger.error("Pagefind failed to create index");
          createErrors.forEach((e) => logger.error(e));
          return;
        }
        const { page_count, errors: addErrors } = await index.addDirectory({
          path: outDir,
        });
        if (addErrors.length) {
          logger.error("Pagefind failed to index files");
          addErrors.forEach((e) => logger.error(e));
          return;
        } else {
          logger.info(`Pagefind indexed ${page_count} pages`);
        }
        const { outputPath, errors: writeErrors } = await index.writeFiles({
          outputPath: path.join(outDir, "pagefind"),
        });
        if (writeErrors.length) {
          logger.error("Pagefind failed to write index");
          writeErrors.forEach((e) => logger.error(e));
          return;
        } else {
          logger.info(`Pagefind wrote index to ${outputPath}`);
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: "http://www.franksbooklog.com",
  trailingSlash: "always",
  devToolbar: {
    enabled: false,
  },
  vite: {
    optimizeDeps: {
      exclude: ["fsevents"],
    },
    plugins: [contentHmr()],
  },
  integrations: [
    react(),
    tailwind({
      // Example: Disable injecting a basic `base.css` import on every page.
      // Useful if you need to define and/or import your own custom `base.css`.
      applyBaseStyles: false,
    }),
    sitemap(),
    pagefind(),
  ],
});
