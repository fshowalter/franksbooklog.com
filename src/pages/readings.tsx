import { graphql } from "gatsby";
import { HeadBuilder, Readings } from "../components";

export function Head(): JSX.Element {
  return (
    <HeadBuilder
      pageTitle="Reading Log"
      description="A chronological list of my reading since 2022."
      image={null}
      article={false}
    />
  );
}

export default function ReadingsPage({
  data,
}: {
  data: Queries.ReadingsPageQuery;
}): JSX.Element {
  return (
    <Readings
      workCount={data.progress.workCount.length}
      items={data.progress.nodes}
      distinctEditions={data.progress.editions}
      distinctPublishedYears={data.progress.publishedYears}
      distinctReadingYears={data.progress.readingYears}
      distinctKinds={data.progress.kinds}
      initialSort="progress-date-desc"
    />
  );
}

export const pageQuery = graphql`
  query ReadingsPage {
    progress: allTimelineEntriesJson(sort: { sequence: DESC }) {
      nodes {
        ...ReadingsData
      }
      publishedYears: distinct(field: { yearPublished: SELECT })
      readingYears: distinct(field: { readingYear: SELECT })
      kinds: distinct(field: { kind: SELECT })
      editions: distinct(field: { edition: SELECT })
      workCount: distinct(field: { sequence: SELECT })
    }
  }
`;
