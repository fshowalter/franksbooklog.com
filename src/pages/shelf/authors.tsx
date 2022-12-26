import { graphql } from "gatsby";
import { AuthorAvatarListWithFilters } from "../../components/AuthorAvatarListWithFilters";
import { HeadBuilder } from "../../components/HeadBuilder";

export function Head(): JSX.Element {
  return (
    <HeadBuilder
      pageTitle={`Authors`}
      description={`A sortable and filterable list of authors.`}
      image={null}
      article={false}
    />
  );
}

export default function AuthorsPAge({
  data,
}: {
  data: Queries.AuthorsPageQuery;
}): JSX.Element {
  return <AuthorAvatarListWithFilters authors={data.author.nodes} />;
}

export const pageQuery = graphql`
  query AuthorsPage {
    author: allAuthorsJson(sort: { sortName: ASC }) {
      nodes {
        ...AuthorAvatarListItem
      }
    }
  }
`;
