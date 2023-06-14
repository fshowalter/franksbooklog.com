import { graphql } from "gatsby";
import { Article, HeadBuilder } from "../components";

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
    <Article
      image={data.backdrop}
      alt="Jake Gittes walks away."
      article={data.page}
    />
  );
}

export const pageQuery = graphql`
  query GonePage {
    backdrop: file(absolutePath: { regex: "/backdrops/gone.png$/" }) {
      ...ArticleBackdrop
    }
    page: markdownRemark(frontmatter: { slug: { eq: "gone" } }) {
      ...ArticleData
    }
  }
`;
