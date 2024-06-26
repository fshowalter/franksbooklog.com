#! /usr/bin/env node

const chokidar = require("chokidar"); // eslint-disable-line import/no-extraneous-dependencies
const fs = require("fs");
const path = require("path");

chokidar
  .watch(["../booklog/reviews", "../booklog/export", "../booklog/readings"])
  .on("all", (event, sourcePath) => {
    if (event === "add" || event === "change") {
      console.log(event, sourcePath); // eslint-disable-line no-console

      let dest;
      const name = sourcePath.replace(
        /..\/booklog\/(export|reviews|readings)\//,
        "",
      );

      if (/\/reviews\//.test(sourcePath)) {
        dest = `${__dirname}/content/reviews/${name}`;
      }

      if (/\/readings\//.test(sourcePath)) {
        dest = `${__dirname}/content/readings/${name}`;
      }

      if (/\/export\//.test(sourcePath)) {
        dest = `${__dirname}/content/data/${name}`;
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
