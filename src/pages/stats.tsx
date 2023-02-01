import { graphql } from "gatsby";
import { HeadBuilder } from "../components/HeadBuilder";
import { StatsPage } from "../components/StatsPage";

export function Head(): JSX.Element {
  return (
    <HeadBuilder
      pageTitle="All-Time Stats"
      description="My most-read authors and other stats."
      article={false}
      image={null}
    />
  );
}

/**
 * Renders the all-time review stats template.
 */
export default function AllTimeStatsPage({
  data,
}: {
  data: Queries.AllTimeStatsPageQuery;
}): JSX.Element {
  const tagline = `${data.reading.years.length.toString()} Years in Review`;
  return (
    <StatsPage
      title="All-Time Stats"
      tagline={tagline}
      mostReadAuthors={data.mostReadAuthors}
      allYears={data.reading.years}
      reviewCount={data.review.totalCount}
      bookCount={data.book.totalCount}
      readingCount={data.reading.totalCount}
      gradeDistributions={data.gradeDistributions.group}
      kindDistributions={data.kindDistributions.group}
      editionDistributions={data.editionDistributions.group}
      decadeDistributions={data.decadeDistributions.group}
    />
  );
}

export const pageQuery = graphql`
  query AllTimeStatsPage {
    mostReadAuthors: mostReadAuthors {
      ...MostReadAuthor
    }

    reading: allReadingsJson {
      years: distinct(field: { year: SELECT })
      totalCount
    }

    review: allMarkdownRemark(filter: { kind: { eq: REVIEW } }) {
      totalCount
    }

    book: allReadingsJson(
      filter: { work: { kind: { nin: ["Short Story", "Novella"] } } }
    ) {
      totalCount
    }

    gradeDistributions: allMarkdownRemark(
      filter: { kind: { eq: REVIEW } }
      sort: { gradeValue: DESC }
    ) {
      group(field: { grade: SELECT }) {
        name: fieldValue
        count: totalCount
      }
    }

    kindDistributions: allReadingsJson(sort: { kind: ASC }) {
      group(field: { kind: SELECT }) {
        name: fieldValue
        count: totalCount
      }
    }

    editionDistributions: allReadingsJson(sort: { edition: ASC }) {
      group(field: { edition: SELECT }) {
        name: fieldValue
        count: totalCount
      }
    }

    decadeDistributions: allReadingsJson(
      sort: { work: { decadePublished: ASC } }
    ) {
      group(field: { work: { decadePublished: SELECT } }) {
        name: fieldValue
        count: totalCount
      }
    }
  }
`;
