import { graphql } from "gatsby";
import { AuthorAvatarListWithFilters } from "../../components/AuthorAvatarListWithFilters";
import { HeadBuilder } from "../../components/HeadBuilder";

export function Head(): JSX.Element {
  return (
    <HeadBuilder
      pageTitle={`Shelf Authors`}
      description={`A sortable and filterable list of authors on my bucketlist shelf of titles.`}
      image={null}
      article={false}
    />
  );
}

export default function ShelfAuthorsPage({
  data,
}: {
  data: Queries.ShelfAuthorsPageQuery;
}): JSX.Element {
  return <AuthorAvatarListWithFilters authors={data.author.nodes} />;
}

export const pageQuery = graphql`
  query ShelfAuthorsPage {
    author: allAuthorsJson(
      filter: { shelfWorkCount: { gt: 0 } }
      sort: { sortName: ASC }
    ) {
      nodes {
        ...AuthorAvatarListItem
      }
    }
  }
`;
