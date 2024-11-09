#! /usr/bin/env node

import chokidar from "chokidar";
import fs from "node:fs";
import path from "node:path";

chokidar
  .watch(["../booklog/reviews", "../booklog/export", "../booklog/readings"], {
    awaitWriteFinish: true,
  })
  .on("all", (event, sourcePath) => {
    if (event === "add" || event === "change") {
      console.log(event, sourcePath);

      let dest;
      const name = sourcePath.replace(
        /..\/booklog\/(export|reviews|readings)\//,
        "",
      );

      if (/\/reviews\//.test(sourcePath)) {
        dest = `${import.meta.dirname}/content/reviews/${name}`;
      }

      if (/\/readings\//.test(sourcePath)) {
        dest = `${import.meta.dirname}/content/readings/${name}`;
      }

      if (/\/export\//.test(sourcePath)) {
        dest = `${import.meta.dirname}/content/data/${name}`;
      }

      const destPath = path.parse(dest).dir;

      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
      }

      if (dest) {
        fs.copyFileSync(sourcePath, dest);
      }
    }
  });
