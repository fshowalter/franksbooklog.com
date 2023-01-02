import { graphql } from "gatsby";
import { Box } from "../Box";
import { GraphqlImage } from "../GraphqlImage";
import { Layout } from "../Layout";
import { LongFormText } from "../LongFormText";
import { PageTitle } from "../PageTitle";
import { Spacer } from "../Spacer";

export function ArticlePage({
  image,
  alt,
  article,
}: {
  image: Queries.ArticlePageBackdropFragment | null;
  alt: string;
  article: Queries.ArticlePageFragment | null;
}): JSX.Element {
  return (
    <Layout>
      <main>
        <Box
          as="article"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <PageTitle
            paddingX="pageMargin"
            paddingY={{ default: 24, desktop: 32 }}
            textAlign="center"
          >
            {article?.frontmatter?.title}
          </PageTitle>
          <GraphqlImage image={image} alt={alt} />
          <Spacer axis="vertical" size={64} />
          <Box paddingX="pageMargin">
            <LongFormText maxWidth="prose" text={article?.html} />
          </Box>
          <Spacer axis="vertical" size={128} />
        </Box>
      </main>
    </Layout>
  );
}

export const query = graphql`
  fragment ArticlePage on MarkdownRemark {
    html
    frontmatter {
      title
    }
  }

  fragment ArticlePageBackdrop on File {
    childImageSharp {
      gatsbyImageData(
        layout: CONSTRAINED
        formats: [JPG, AVIF]
        quality: 80
        width: 1000
        placeholder: BLURRED
      )
    }
  }
`;
