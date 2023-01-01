import { graphql } from "gatsby";
import { ArticlePage } from "../components/ArticlePage";
import { HeadBuilder } from "../components/HeadBuilder";

export function Head(): JSX.Element {
  return (
    <HeadBuilder
      pageTitle="How I Grade"
      description="The criteria I use to rate movies on this site."
      image={null}
      article
    />
  );
}

export default function HowIGradePage({
  data,
}: {
  data: Queries.HowIGradePageQuery;
}): JSX.Element {
  return (
    <ArticlePage
      image={data.backdrop}
      alt="Empty cinema seats."
      article={data.page}
    />
  );
}

export const pageQuery = graphql`
  query HowIGradePage {
    backdrop: file(absolutePath: { regex: "/backdrops/how-i-grade.png$/" }) {
      ...ArticlePageBackdrop
    }
    page: markdownRemark(frontmatter: { slug: { eq: "how-i-grade" } }) {
      ...ArticlePage
    }
  }
`;
