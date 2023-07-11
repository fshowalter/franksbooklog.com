import type { CreatePagesArgs } from "gatsby";
import path from "path";

const query = `#graphql
{ 
  readings: readingsWithReviews {
    id
  }
}`;

interface QueryResult {
  readings: {
    id: string;
  }[];
}

export async function createHomePages({
  graphql,
  reporter,
  actions,
}: CreatePagesArgs) {
  const { createPage } = actions;
  const queryResult = await graphql<QueryResult>(query);

  if (!queryResult.data || queryResult.errors) {
    reporter.panicOnBuild(
      `Error while running GraphQL query for home updates.`,
    );
    return;
  }

  const updates = queryResult.data.readings;
  const perPage = 10;
  const numPages = Math.ceil(updates.length / perPage);
  Array.from({ length: numPages }).forEach((_, i) => {
    const skip = i * perPage;

    createPage({
      path: i === 0 ? `/` : `/page-${i + 1}/`,
      component: path.resolve("./src/templates/home.tsx"),
      context: {
        limit: perPage,
        skip,
        numberOfItems: updates.length,
        currentPage: i + 1,
      },
    });
  });
}
