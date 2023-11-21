import { graphql } from "gatsby";
import { HeadBuilder, Stats } from "../components";

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

export default function AllTimeStatsPage({
  data,
}: {
  data: Queries.AllTimeStatsPageQuery;
}): JSX.Element {
  return (
    <Stats
      title="All-Time Stats"
      tagline={`${data.reading.years.length.toString()} Years in Review`}
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

    review: allReviewedWorksJson {
      totalCount
    }

    book: allReadingsJson(
      filter: { work: { kind: { nin: ["Short Story", "Novella"] } } }
    ) {
      totalCount
    }

    gradeDistributions: allReviewedWorksJson(sort: { gradeValue: DESC }) {
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
