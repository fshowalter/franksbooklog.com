import { graphql } from "gatsby";
import { Box } from "../components/Box";
import { CoverListWithFilters } from "../components/CoverListWithFilters";
import { HeadBuilder } from "../components/HeadBuilder";
import { Link } from "../components/Link";
import { PageTitle } from "../components/PageTitle";
import { Spacer } from "../components/Spacer";
import { foregroundColors } from "../styles/colors.css";

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
          More <Link to="/stats/">reading stats</Link>.
        </p>
        <Spacer axis="vertical" size={32} />
        <Box display="flex" justifyContent="center">
          <Link
            to="/reviews/authors"
            display="flex"
            columnGap={16}
            boxShadow="borderAll"
            paddingX={16}
            paddingY={8}
            borderRadius={8}
            alignItems="center"
            justifyContent="center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={foregroundColors.default}
              width={20}
              height={20}
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Browse Authors
          </Link>
        </Box>
      </Box>
    </CoverListWithFilters>
  );
}

export const pageQuery = graphql`
  fragment ReviewsPageAuthor on WorkAuthor {
    name
    notes
    sortName
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
        id
        sequence
        grade
        slug: workSlug
        edition
        date: date(formatString: "MMM D, YYYY")
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
      readYears: distinct(field: { year: SELECT })
      kinds: distinct(field: { kind: SELECT })
      grades: distinct(field: { grade: SELECT })
    }
  }
`;
