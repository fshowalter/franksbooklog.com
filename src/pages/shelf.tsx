import { graphql } from "gatsby";
import { HeadBuilder, Shelf } from "../components";

export function Head(): JSX.Element {
  return (
    <HeadBuilder
      pageTitle="The Shelf"
      description="My to-read list."
      image={null}
      article={false}
    />
  );
}

export default function ShelfPage({
  data,
}: {
  data: Queries.ShelfPageQuery;
}): JSX.Element {
  return (
    <Shelf
      items={data.work.nodes}
      distinctKinds={data.work.kinds}
      distinctPublishedYears={data.work.publishedYears}
      distinctAuthors={data.work.authors}
      initialSort="author-asc"
    />
  );
}

export const pageQuery = graphql`
  query ShelfPage {
    work: allUnreviewedWorksJson(
      filter: { review: { id: { eq: null } } }
      sort: [{ authors: { sortName: ASC } }, { yearPublished: ASC }]
    ) {
      nodes {
        ...ShelfData
      }
      publishedYears: distinct(field: { yearPublished: SELECT })
      authors: distinct(field: { authors: { name: SELECT } })
      kinds: distinct(field: { kind: SELECT })
    }
  }
`;
