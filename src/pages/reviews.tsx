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
      description="A sortable and filterable list of every book or short story I've read and reviewed since 2022."
      image={null}
      article={false}
    />
  );
}

/**
 * Renders the reviews page.
 */
export default function ReviewsPage({
  data,
}: {
  data: Queries.ReviewsPageQuery;
}): JSX.Element {
  return (
    <CoverListWithFilters
      items={data.reading.nodes}
      distinctEditions={data.reading.editions}
      distinctGrades={data.reading.grades}
      distinctKinds={data.reading.kinds}
      distinctPublishedYears={data.reading.publishedYears}
      distinctReadYears={data.reading.readYears}
      initialSort="sequence-desc"
    >
      <PageTitle textAlign="center">Reviews</PageTitle>
      <Box as="q" display="block" textAlign="center" color="subtle">
        I intend to put up with nothing that I can put down.
      </Box>
      <Spacer axis="vertical" size={16} />

      <Box color="subtle">
        <Spacer axis="vertical" size={16} />
        <p>
          Since 2022, I&apos;ve published{" "}
          <Box as="span" color="emphasis">
            {data.reviews.totalCount.toLocaleString()}
          </Box>{" "}
          reviews comprising{" "}
          <Box as="span" color="emphasis">
            {data.shortStory.totalCount.toLocaleString()}
          </Box>{" "}
          short stories and{" "}
          <Box as="span" color="emphasis">
            {data.books.totalCount.toLocaleString()}
          </Box>{" "}
          books (
          <Box as="span" color="emphasis">
            {data.abandoned.totalCount.toLocaleString()}
          </Box>{" "}
          abandoned).
        </p>
        <Spacer axis="vertical" size={16} />
        <p>
          Peruse more <Link to="/stats/">reading stats</Link>.
        </p>
        <Spacer axis="vertical" size={16} />
      </Box>
    </CoverListWithFilters>
  );
}

export const pageQuery = graphql`
  fragment ReviewsPageAuthor on WorkAuthor {
    name
    notes
  }

  query ReviewsPage {
    reviews: allMarkdownRemark(filter: { kind: { eq: REVIEW } }) {
      totalCount
    }
    books: allReadingsJson(
      filter: { review: { id: { ne: null } }, kind: { ne: "Short Story" } }
    ) {
      totalCount
    }
    shortStory: allReadingsJson(
      filter: { review: { id: { ne: null } }, kind: { eq: "Short Story" } }
    ) {
      totalCount
    }
    abandoned: allReadingsJson(
      filter: { review: { id: { ne: null } }, abandoned: { eq: true } }
    ) {
      totalCount
    }
    reading: allReadingsJson(sort: { sequence: DESC }) {
      totalCount
      nodes {
        sequence
        grade
        slug: workSlug
        edition
        dateFinished: dateFinished(formatString: "MMM D, YYYY")
        gradeValue
        title
        yearPublished
        sortTitle
        kind
        authors {
          ...ReviewsPageAuthor
        }
        cover {
          ...CoverListCover
        }
      }
      editions: distinct(field: { edition: SELECT })
      publishedYears: distinct(field: { yearPublished: SELECT })
      readYears: distinct(field: { yearFinished: SELECT })
      kinds: distinct(field: { kind: SELECT })
      grades: distinct(field: { grade: SELECT })
    }
  }
`;
