import { useRef } from "react";
import { Box } from "../Box";
import { Layout } from "../Layout";
import { HomePageItem } from "./HomePageItem";
import { Pagination } from "./Pagination";

export function Home({
  items,
  limit,
  skip,
  numberOfItems,
  currentPageNumber,
}: {
  items: readonly Queries.HomePageItemFragment[];
  limit: number;
  skip: number;
  numberOfItems: number;
  currentPageNumber: number;
}): JSX.Element {
  const listHeader = useRef<HTMLDivElement>(null);

  return (
    <Layout>
      <Box as="main" innerRef={listHeader}>
        <Box as="ol" display="flex" flexDirection="column">
          {items.map((reading, index) => {
            return (
              <HomePageItem
                eagerLoadCoverImage={index === 0}
                key={reading.sequence}
                counterValue={numberOfItems - skip - index}
                item={reading}
              />
            );
          })}
        </Box>
        <Pagination
          currentPage={currentPageNumber}
          urlRoot="/"
          perPage={limit}
          numberOfItems={numberOfItems}
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
