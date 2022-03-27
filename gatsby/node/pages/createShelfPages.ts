import type { Actions, CreatePagesArgs } from "gatsby";
import path from "path";

function createIndexPage(createPage: Actions["createPage"]) {
  createPage({
    path: `/shelf/`,
    context: null,
    component: path.resolve(
      "./src/components/ShelfIndexPage/ShelfIndexPage.tsx"
    ),
  });
}

export default function createShelfPages({ actions }: CreatePagesArgs) {
  const { createPage } = actions;

  createIndexPage(createPage);
}
