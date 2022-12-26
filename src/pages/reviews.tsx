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
          Since 2012, I&apos;ve watched{" "}
          <Box as="span" color="emphasis">
            {data.reading.nodes.length.toLocaleString()}
          </Box>{" "}
          movies and published{" "}
          <Box as="span" color="emphasis">
            {data.reviews?.totalCount.toLocaleString()}
          </Box>{" "}
          reviews.
        </p>
        <Spacer axis="vertical" size={16} />
        <p>
          <Box as="span" fontWeight="semiBold">
            Looking for something new?
          </Box>
          <br /> Peruse my list of{" "}
          <Link to="/reviews/underseen/">underseen gems</Link>.
        </p>
        <Spacer axis="vertical" size={16} />
        <p>
          <Box as="span" fontWeight="semiBold">
            Feeling contrarian?
          </Box>
          <br />
          Behold my list of{" "}
          <Link to="/reviews/overrated/">overrated disappointments</Link>.
        </p>
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
    reading: allReadingsJson(sort: { sequence: DESC }) {
      totalCount
      nodes {
        sequence
        grade
        workSlug
        edition
        yearFinished
        monthFinished: dateFinished(formatString: "MMMM YYYY")
        dateFinished
        dateFinishedFormatted: dateFinished(formatString: "MMM D, YYYY")
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
    }
  }
`;
