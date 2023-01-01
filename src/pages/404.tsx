import { graphql } from "gatsby";
import { ArticlePage } from "../components/ArticlePage";
import { HeadBuilder } from "../components/HeadBuilder";

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
    <ArticlePage
      image={data.backdrop}
      alt="A lost highway."
      article={data.page}
    />
  );
}

export const pageQuery = graphql`
  query NotFoundPage {
    backdrop: file(absolutePath: { regex: "/backdrops/not-found.png$/" }) {
      ...ArticlePageBackdrop
    }
    page: markdownRemark(frontmatter: { slug: { eq: "not-found" } }) {
      ...ArticlePage
    }
  }
`;
