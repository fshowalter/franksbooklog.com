import { graphql } from "gatsby";
import { Authors, HeadBuilder } from "../../components";

export function Head(): JSX.Element {
  return (
    <HeadBuilder
      pageTitle={`Authors`}
      description={`A sortable and filterable list of authors I've read.`}
      image={null}
      article={false}
    />
  );
}

export default function ReviewAuthorsPage({
  data,
}: {
  data: Queries.ReviewsAuthorsPageQuery;
}): JSX.Element {
  return <Authors items={data.author.nodes} initialSort="name-asc" />;
}

export const pageQuery = graphql`
  query ReviewsAuthorsPage {
    author: allAuthorsJson(
      filter: { reviewedWorkCount: { gt: 0 } }
      sort: { sortName: ASC }
    ) {
      nodes {
        ...AuthorsListItem
      }
    }
  }
`;
