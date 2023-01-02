import { graphql } from "gatsby";
import { useRef } from "react";
import { Box } from "../components/Box";
import { HeadBuilder } from "../components/HeadBuilder";
import { HomePageItem } from "../components/HomePageItem";
import { Layout } from "../components/Layout";
import { Pagination } from "../components/Pagination";

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

export default function HomePage({
  pageContext,
  data,
}: {
  pageContext: PageContext;
  data: Queries.HomeTemplateQuery;
}): JSX.Element {
  const listHeader = useRef<HTMLDivElement>(null);

  return (
    <Layout>
      <Box as="main" innerRef={listHeader}>
        <Box as="ol" display="flex" flexDirection="column">
          {data.readings.map((reading, index) => {
            return (
              <HomePageItem
                eagerLoadCoverImage={index === 0}
                key={reading.sequence}
                counterValue={
                  pageContext.numberOfItems - pageContext.skip - index
                }
                item={reading}
              />
            );
          })}
        </Box>
        <Pagination
          currentPage={pageContext.currentPage}
          urlRoot="/"
          perPage={pageContext.limit}
          numberOfItems={pageContext.numberOfItems}
          prevText="Newer"
          nextText="Older"
          paddingX="pageMargin"
          paddingY={40}
          justifyContent="center"
        />
      </Box>
    </Layout>
  );
}

export const pageQuery = graphql`
  query HomeTemplate($skip: Int!, $limit: Int!) {
    readings: readingsWithReviews(
      sort: { sequence: DESC }
      limit: $limit
      skip: $skip
    ) {
      ...HomePageItem
    }
  }
`;
