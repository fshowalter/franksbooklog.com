import type { Actions, CreatePagesArgs } from "gatsby";
import path from "path";

const query = `#graphql
{
  work: allReviewedWorksJson {
    nodes {
      id
      slug
    }
  }
}
`;

interface QueryResult {
  work: {
    nodes: {
      id: string;
      slug: string;
    }[];
  };
}

async function createIndividualReviewPages(
  createPage: Actions["createPage"],
  graphql: CreatePagesArgs["graphql"],
  reporter: CreatePagesArgs["reporter"]
) {
  const queryResult = await graphql<QueryResult>(query);

  if (!queryResult.data || queryResult.errors) {
    reporter.panicOnBuild(
      `Error while running GraphQL query for review pages.`
    );
    return;
  }

  // Review pages
  queryResult.data.work.nodes.forEach((node) => {
    createPage({
      path: `/reviews/${node.slug}/`,
      component: path.resolve("./src/templates/review.tsx"),
      context: {
        id: node.id,
      },
    });
  });
}

export async function createReviewPages({
  graphql,
  reporter,
  actions,
}: CreatePagesArgs) {
  const { createPage } = actions;

  await createIndividualReviewPages(createPage, graphql, reporter);
}
