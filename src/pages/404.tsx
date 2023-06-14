import { graphql } from "gatsby";
import { Article, HeadBuilder } from "../components";

export function Head(): JSX.Element {
  return (
    <HeadBuilder
      pageTitle="404: Not Found"
      description="Dick Laurent is dead."
      image={null}
      article
    />
  );
}

export default function NotFoundPage({
  data,
}: {
  data: Queries.NotFoundPageQuery;
}): JSX.Element {
  return (
    <Article image={data.backdrop} alt="A lost highway." article={data.page} />
  );
}

export const pageQuery = graphql`
  query NotFoundPage {
    backdrop: file(absolutePath: { regex: "/backdrops/not-found.png$/" }) {
      ...ArticleBackdrop
    }
    page: markdownRemark(frontmatter: { slug: { eq: "not-found" } }) {
      ...ArticleData
    }
  }
`;
