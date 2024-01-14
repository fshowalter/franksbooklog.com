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
    data.reading.years[data.reading.years.length - 1]
      ? "A Year in Progress.."
      : "A Year in Review";

  return (
    <Stats
      title={`${pageContext.year} Stats`}
      tagline={tagline}
      data={data.readingStats}
      allYears={data.reading.years}
    />
  );
}

export const pageQuery = graphql`
  query StatsForYearTemplate($year: String!) {
    reading: allTimelineEntriesJson {
      years: distinct(field: { readingYear: SELECT })
    }

    readingStats(span: $year) {
      ...StatsData
    }
  }
`;
