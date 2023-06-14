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

export default function AuthorsPage({
  data,
}: {
  data: Queries.AuthorsPageQuery;
}): JSX.Element {
  return <Authors items={data.author.nodes} initialSort="name-asc" />;
}

export const pageQuery = graphql`
  query AuthorsPage {
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
