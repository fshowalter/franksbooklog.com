import { graphql } from "gatsby";
import { Box } from "../components/Box";
import { CoverListWithFilters } from "../components/CoverListWithFilters";
import { HeadBuilder } from "../components/HeadBuilder";
import { Link } from "../components/Link";
import { PageTitle } from "../components/PageTitle";
import { Spacer } from "../components/Spacer";

export function Head(): JSX.Element {
  return (
    <HeadBuilder
      pageTitle="Reviews"
      description="A sortable and filterable list of every movie I've watched and reviewed since 2012."
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
      initialSort="read-date-desc"
    >
      <PageTitle textAlign="center">Reviews</PageTitle>
      <Box as="q" display="block" textAlign="center" color="subtle">
        We have such sights to show you.
      </Box>
      <Spacer axis="vertical" size={16} />

      <Box color="subtle">
        <Spacer axis="vertical" size={16} />
        <p>
          My reading bucketlist.
          <Box as="span" color="emphasis">
            {data.work.nodes.length.toLocaleString()}
          </Box>{" "}
          titles.
        </p>
        <Spacer axis="vertical" size={16} />
        <p>
          Track my <Link to="/shelf/progress/">progress</Link>.
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
      sort: [{ authors: { sortName: ASC } }, { yearPublished: ASC }]
    ) {
      nodes {
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
