import { graphql } from "gatsby";
import { HeadBuilder, Home } from "../components";

export function Head({
  pageContext,
}: {
  pageContext: PageContext;
}): JSX.Element {
  return (
    <HeadBuilder
      pageTitle={
        pageContext.currentPage === 1
          ? "Frank's Book Log: Literature is a relative term."
          : `Page ${pageContext.currentPage}`
      }
      description="Reviews of current, cult, classic, and forgotten books."
      article={false}
      image={null}
    />
  );
}

interface PageContext {
  limit: number;
  skip: number;
  numberOfItems: number;
  currentPage: number;
}

export default function HomeTemplate({
  pageContext,
  data,
}: {
  pageContext: PageContext;
  data: Queries.HomeTemplateQuery;
}): JSX.Element {
  return (
    <Home
      items={data.update.nodes}
      numberOfItems={pageContext.numberOfItems}
      skip={pageContext.skip}
      limit={pageContext.limit}
      currentPageNumber={pageContext.currentPage}
    />
  );
}

export const pageQuery = graphql`
  query HomeTemplate($skip: Int!, $limit: Int!) {
    update: allUpdatesJson(
      sort: { sequence: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        ...HomeListItem
      }
    }
  }
`;
