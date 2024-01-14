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
      data={data.readingStats}
      allYears={data.reading.years}
    />
  );
}

export const pageQuery = graphql`
  query AllTimeStatsPage {
    reading: allTimelineEntriesJson {
      years: distinct(field: { readingYear: SELECT })
    }

    readingStats(span: "all-time") {
      ...StatsData
    }
  }
`;
