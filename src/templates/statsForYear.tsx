import { graphql } from "gatsby";
import { HeadBuilder } from "../components/HeadBuilder";
import { StatsPage } from "../components/StatsPage";

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
    data.allReading.years.length === 1
      ? "The Booklog in Review"
      : data.allReading.years.length === 2
      ? "A Year in Review"
      : `${(data.allReading.years.length - 1).toString()} Years in Review`;

  return (
    <StatsPage
      title={`${pageContext.year} Stats`}
      tagline={tagline}
      mostReadAuthors={data.mostReadAuthors}
      allYears={data.allReading.years}
      reviewCount={data.review.totalCount}
      bookCount={data.book.totalCount}
      readingCount={data.reading.totalCount}
      fromShelfCount={data.fromShelf.totalCount}
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
      years: distinct(field: { yearFinished: SELECT })
    }

    reading: allReadingsJson(filter: { yearFinished: { eq: $year } }) {
      totalCount
    }

    review: allMarkdownRemark(
      filter: { kind: { eq: REVIEW }, year: { eq: $year } }
    ) {
      totalCount
    }

    book: allReadingsJson(
      filter: {
        work: { kind: { nin: [SHORTSTORY, NOVELLA] } }
        yearFinished: { eq: $year }
      }
    ) {
      totalCount
    }

    fromShelf: allWorksJson(
      filter: { shelf: { eq: true }, review: { year: { eq: $year } } }
    ) {
      totalCount
    }

    gradeDistributions: allMarkdownRemark(
      filter: { kind: { eq: REVIEW }, year: { eq: $year } }
      sort: { gradeValue: DESC }
    ) {
      group(field: { grade: SELECT }) {
        name: fieldValue
        count: totalCount
      }
    }

    kindDistributions: allReadingsJson(
      filter: { yearFinished: { eq: $year } }
      sort: { kind: ASC }
    ) {
      group(field: { kind: SELECT }) {
        name: fieldValue
        count: totalCount
      }
    }

    editionDistributions: allReadingsJson(
      filter: { yearFinished: { eq: $year } }
      sort: { edition: ASC }
    ) {
      group(field: { edition: SELECT }) {
        name: fieldValue
        count: totalCount
      }
    }

    decadeDistributions: allReadingsJson(
      filter: { yearFinished: { eq: $year } }
      sort: { work: { decadePublished: ASC } }
    ) {
      group(field: { work: { decadePublished: SELECT } }) {
        name: fieldValue
        count: totalCount
      }
    }
  }
`;
