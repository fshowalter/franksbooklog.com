import { graphql } from "gatsby";
import { HeadBuilder, Stats } from "../components";

interface IPageContext {
  year: number;
}

export function Head({
  pageContext,
}: {
  pageContext: IPageContext;
}): JSX.Element {
  return (
    <HeadBuilder
      pageTitle={`${pageContext.year} Stats`}
      description={`My most-watched read authors and other stats for ${pageContext.year}.`}
      article={false}
      image={null}
    />
  );
}

/**
 * Renders the all-time review stats template.
 */
export default function StatsForYearTemplate({
  pageContext,
  data,
}: {
  pageContext: IPageContext;
  data: Queries.StatsForYearTemplateQuery;
}): JSX.Element {
  const tagline =
    pageContext.year.toString() ===
    data.allReading.years[data.allReading.years.length - 1]
      ? "A Year in Progress.."
      : "A Year in Review";

  return (
    <Stats
      title={`${pageContext.year} Stats`}
      tagline={tagline}
      mostReadAuthors={data.mostReadAuthors}
      allYears={data.allReading.years}
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
  query StatsForYearTemplate($year: Int!) {
    mostReadAuthors: mostReadAuthors(year: $year) {
      ...MostReadAuthor
    }

    allReading: allReadingsJson {
      years: distinct(field: { year: SELECT })
    }

    reading: allReadingsJson(filter: { year: { eq: $year } }) {
      totalCount
    }

    review: allFile(
      filter: {
        sourceInstanceName: { eq: "reviews" }
        childrenMarkdownRemark: { elemMatch: { year: { eq: $year } } }
      }
    ) {
      totalCount
    }

    book: allReadingsJson(
      filter: {
        work: { kind: { nin: ["Short Story", "Novella"] } }
        year: { eq: $year }
      }
    ) {
      totalCount
    }

    gradeDistributions: allFile(
      filter: {
        sourceInstanceName: { eq: "reviews" }
        childrenMarkdownRemark: { elemMatch: { year: { eq: $year } } }
      }
      sort: { childMarkdownRemark: { gradeValue: DESC } }
    ) {
      group(
        field: { childMarkdownRemark: { frontmatter: { grade: SELECT } } }
      ) {
        name: fieldValue
        count: totalCount
      }
    }

    kindDistributions: allReadingsJson(
      filter: { year: { eq: $year } }
      sort: { kind: ASC }
    ) {
      group(field: { kind: SELECT }) {
        name: fieldValue
        count: totalCount
      }
    }

    editionDistributions: allReadingsJson(
      filter: { year: { eq: $year } }
      sort: { edition: ASC }
    ) {
      group(field: { edition: SELECT }) {
        name: fieldValue
        count: totalCount
      }
    }

    decadeDistributions: allReadingsJson(
      filter: { year: { eq: $year } }
      sort: { work: { decadePublished: ASC } }
    ) {
      group(field: { work: { decadePublished: SELECT } }) {
        name: fieldValue
        count: totalCount
      }
    }
  }
`;
