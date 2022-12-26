import type { CreatePagesArgs } from "gatsby";
import path from "path";

interface QueryResult {
  author: {
    nodes: {
      id: string;
      slug: string;
    }[];
  };
}

export async function createAuthorPages({
  graphql,
  reporter,
  actions,
}: CreatePagesArgs) {
  const { createPage } = actions;

  const queryResult = await graphql<QueryResult>(`
    {
      author: allAuthorsJson(filter: { reviewedWorkCount: { gt: 0 } }) {
        nodes {
          id
          slug
        }
      }
    }
  `);

  if (!queryResult.data || queryResult.errors) {
    reporter.panicOnBuild(`Error while running query for author pages.`);
    return;
  }

  queryResult.data.author.nodes.forEach((node) => {
    createPage({
      path: `/shelf/authors/${node.slug}/`,
      component: path.resolve("./src/templates/author.tsx"),
      context: {
        slug: node.slug,
        id: node.id,
      },
    });
  });
}
