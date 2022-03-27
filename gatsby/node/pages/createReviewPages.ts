import type { Actions, CreatePagesArgs } from "gatsby";
import path from "path";

function createReviewsIndexPage(createPage: Actions["createPage"]) {
  // Index page
  createPage({
    context: null,
    path: `/reviews/`,
    component: path.resolve(
      "./src/components/ReviewsIndexPage/ReviewsIndexPage.tsx"
    ),
  });
}

const query = `
{
  work: allWorksJson(filter: {reviewed: {eq: true}}) {
    nodes {
      slug
    }
  }
}
`;

interface QueryResult {
  work: {
    nodes: {
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
      component: path.resolve("./src/components/ReviewPage/ReviewPage.tsx"),
      context: {
        slug: node.slug,
      },
    });
  });
}

export default async function createReviewPages({
  graphql,
  reporter,
  actions,
}: CreatePagesArgs) {
  const { createPage } = actions;

  createReviewsIndexPage(createPage);
  await createIndividualReviewPages(createPage, graphql, reporter);
}
