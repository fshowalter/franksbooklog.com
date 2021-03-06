import type { CreatePagesArgs } from "gatsby";
import path from "path";

const query = `
{
  reviews: allMarkdownRemark(
    filter: { postType: { eq: "REVIEW" } }
    sort: { fields: frontmatter___sequence, order: DESC }
  ) {
    nodes {
      frontmatter {
        slug
      }
    }
  }
}
`;

interface QueryResult {
  reviews: {
    nodes: {
      frontmatter: {
        slug: string;
      };
    }[];
  };
}

export default async function createHomePages({
  graphql,
  reporter,
  actions,
}: CreatePagesArgs) {
  const { createPage } = actions;
  const queryResult = await graphql<QueryResult>(query);

  if (!queryResult.data || queryResult.errors) {
    reporter.panicOnBuild(
      `Error while running GraphQL query for home updates.`
    );
    return;
  }

  const updates = queryResult.data.reviews.nodes;
  const perPage = 10;
  const numPages = Math.ceil(updates.length / perPage);
  Array.from({ length: numPages }).forEach((_, i) => {
    const skip = i * perPage;

    createPage({
      path: i === 0 ? `/` : `/page-${i + 1}/`,
      component: path.resolve("./src/components/HomePage/HomePage.tsx"),
      context: {
        limit: perPage,
        skip,
        numberOfItems: updates.length,
        currentPage: i + 1,
      },
    });
  });
}
