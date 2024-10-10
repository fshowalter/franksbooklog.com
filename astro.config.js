import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createIndex } from "pagefind";
import sirv from "sirv";

function contentHmr() {
  return {
    enforce: "post",
    // HMR
    handleHotUpdate({ file, server }) {
      console.log(file);
      if (file.includes("/content/")) {
        console.log("reloading content file...");
        server.ws.send({
          path: "*",
          type: "full-reload",
        });
      }
    },
    name: "content-hmr",
  };
}

function pagefind() {
  let outDir;
  let assets;
  return {
    hooks: {
      "astro:build:done": async ({ logger }) => {
        if (!outDir) {
          logger.warn(
            "astro-pagefind couldn't reliably determine the output directory. Search index will not be built.",
          );
          return;
        }

        const { errors: createErrors, index } = await createIndex({});
        if (!index) {
          logger.error("Pagefind failed to create index");
          createErrors.forEach((e) => logger.error(e));
          return;
        }
        const { errors: addErrors, page_count } = await index.addDirectory({
          path: outDir,
        });
        if (addErrors.length) {
          logger.error("Pagefind failed to index files");
          addErrors.forEach((e) => logger.error(e));
          return;
        } else {
          logger.info(`Pagefind indexed ${page_count} pages`);
        }
        const { errors: writeErrors, outputPath } = await index.writeFiles({
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
      "astro:config:setup": ({ config }) => {
        outDir = fileURLToPath(config.outDir);

        if (config.build.assetsPrefix) {
          assets = null;
        } else {
          assets = config.build.assets;
        }
      },
      "astro:server:setup": ({ logger, server }) => {
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
    },
    name: "pagefind",
  };
}

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
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
  site: "http://www.franksbooklog.com",
  trailingSlash: "always",
  vite: {
    optimizeDeps: {
      exclude: ["fsevents"],
    },
    plugins: [contentHmr()],
  },
});
