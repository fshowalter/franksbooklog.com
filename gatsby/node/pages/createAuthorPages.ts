import type { Actions, CreatePagesArgs } from "gatsby";
import path from "path";

interface QueryResult {
  author: {
    nodes: {
      slug: string;
    }[];
  };
}

async function createIndivdualAuthorPages(
  graphql: CreatePagesArgs["graphql"],
  reporter: CreatePagesArgs["reporter"],
  createPage: Actions["createPage"]
) {
  const queryResult = await graphql<QueryResult>(
    `
      {
        author: allAuthorsJson(filter: { reviewed: { eq: true } }) {
          nodes {
            slug
          }
        }
      }
    `
  );

  if (!queryResult.data || queryResult.errors) {
    reporter.panicOnBuild(`Error while running query watchlist directors.`);
    return;
  }

  queryResult.data.author.nodes.forEach((node) => {
    createPage({
      path: `/shelf/authors/${node.slug}/`,
      component: path.resolve("./src/components/AuthorPage/AuthorPage.tsx"),
      context: {
        slug: node.slug,
      },
    });
  });
}

function createIndexPage(createPage: Actions["createPage"]) {
  createPage({
    path: `/shelf/authors/`,
    context: null,
    component: path.resolve(
      "./src/components/AuthorsIndexPage/AuthorsIndexPage.tsx"
    ),
  });
}

export default async function createAuthorPages({
  graphql,
  reporter,
  actions,
}: CreatePagesArgs) {
  const { createPage } = actions;

  createIndexPage(createPage);
  await createIndivdualAuthorPages(graphql, reporter, createPage);
}
