import { graphql } from "gatsby";
import { ArticlePage } from "../components/ArticlePage";
import { HeadBuilder } from "../components/HeadBuilder";

export function Head(): JSX.Element {
  return (
    <HeadBuilder
      pageTitle="410: Gone"
      description="Forget it, Jake. It's Chinatown."
      image={null}
      article
    />
  );
}

export default function GonePage({
  data,
}: {
  data: Queries.GonePageQuery;
}): JSX.Element {
  return (
    <ArticlePage
      image={data.backdrop}
      alt="Jake Gittes walks away."
      article={data.page}
    />
  );
}

export const pageQuery = graphql`
  query GonePage {
    backdrop: file(absolutePath: { regex: "/backdrops/gone.png$/" }) {
      ...ArticlePageBackdrop
    }
    page: markdownRemark(frontmatter: { slug: { eq: "gone" } }) {
      ...ArticlePage
    }
  }
`;
