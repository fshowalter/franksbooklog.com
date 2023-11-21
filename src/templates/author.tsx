import { graphql } from "gatsby";
import { Author, HeadBuilder } from "../components";

export function Head({
  data,
}: {
  data: Queries.AuthorTemplateQuery;
}): JSX.Element {
  return (
    <HeadBuilder
      pageTitle={data.author.name}
      description={`A sortable and filterable list of reviews of works by ${data.author.name}.`}
      image={null}
      article={false}
    />
  );
}

export default function AuthorTemplate({
  data,
}: {
  data: Queries.AuthorTemplateQuery;
}): JSX.Element {
  return (
    <Author
      data={data.author}
      distinctPublishedYears={data.distinct.publishedYears}
      distinctKinds={data.distinct.kinds}
      initialSort="year-published-asc"
    />
  );
}

export const pageQuery = graphql`
  query AuthorTemplate($id: String!) {
    author: authorsJson(id: { eq: $id }) {
      ...AuthorData
    }
    distinct: allAuthorsJson(
      filter: { id: { eq: $id }, reviewedWorkCount: { gt: 0 } }
    ) {
      publishedYears: distinct(field: { works: { yearPublished: SELECT } })
      kinds: distinct(field: { works: { kind: SELECT } })
    }
  }
`;
