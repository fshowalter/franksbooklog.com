import { graphql } from "gatsby";
import { AuthorAvatarListWithFilters } from "../../components/AuthorAvatarListWithFilters";
import { HeadBuilder } from "../../components/HeadBuilder";

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
  return <AuthorAvatarListWithFilters authors={data.author.nodes} />;
}

export const pageQuery = graphql`
  query ReviewsAuthorsPage {
    author: allAuthorsJson(
      filter: { reviewedWorkCount: { gt: 0 } }
      sort: { sortName: ASC }
    ) {
      nodes {
        ...AuthorAvatarListItem
      }
    }
  }
`;
