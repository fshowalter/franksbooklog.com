import { graphql } from "gatsby";
import { Box } from "../components/Box";
import { CoverListWithFilters } from "../components/CoverListWithFilters";
import { HeadBuilder } from "../components/HeadBuilder";
import { PageTitle } from "../components/PageTitle";
import { Spacer } from "../components/Spacer";

export function Head(): JSX.Element {
  return (
    <HeadBuilder
      pageTitle="The Shelf"
      description="My to-read list."
      image={null}
      article={false}
    />
  );
}

/**
 * Renders the reviews page.
 */
export default function ShelfPage({
  data,
}: {
  data: Queries.ShelfPageQuery;
}): JSX.Element {
  return (
    <CoverListWithFilters
      items={data.work.nodes}
      distinctKinds={data.work.kinds}
      distinctPublishedYears={data.work.publishedYears}
      distinctAuthors={data.work.authors}
      initialSort="author-asc"
    >
      <PageTitle textAlign="center">The Shelf</PageTitle>
      <Box as="q" display="block" textAlign="center" color="subtle">
        Classic: A book which people praise and don’t read.
      </Box>
      <Spacer axis="vertical" size={16} />

      <Box color="subtle" textAlign="center">
        <Spacer axis="vertical" size={16} />
        <p>
          My to-read list.{" "}
          <Box as="span" color="emphasis">
            {data.work.nodes.length.toLocaleString()}
          </Box>{" "}
          titles.
        </p>
      </Box>
    </CoverListWithFilters>
  );
}

export const pageQuery = graphql`
  fragment ShelfPageAuthor on WorkAuthor {
    name
    sortName
    slug
    notes
  }

  query ShelfPage {
    work: allWorksJson(
      filter: { review: { id: { eq: null } } }
      sort: [{ authors: { sortName: ASC } }, { yearPublished: ASC }]
    ) {
      nodes {
        id
        title
        yearPublished
        sortTitle
        slug
        kind
        grade
        gradeValue
        authors {
          ...ShelfPageAuthor
        }
        cover {
          ...CoverListCover
        }
      }
      publishedYears: distinct(field: { yearPublished: SELECT })
      authors: distinct(field: { authors: { name: SELECT } })
      kinds: distinct(field: { kind: SELECT })
    }
  }
`;
