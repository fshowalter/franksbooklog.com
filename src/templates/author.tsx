import { graphql } from "gatsby";
import { Box } from "../components/Box";
import { CoverListWithFilters } from "../components/CoverListWithFilters";
import { GraphqlImage } from "../components/GraphqlImage";
import { HeadBuilder } from "../components/HeadBuilder";
import { Link } from "../components/Link";
import { PageTitle } from "../components/PageTitle";
import { Spacer } from "../components/Spacer";

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

/**
 * Renders a page for a work author.
 */
export default function AuthorTemplate({
  data,
}: {
  data: Queries.AuthorTemplateQuery;
}): JSX.Element {
  return (
    <CoverListWithFilters
      items={data.author.works}
      distinctPublishedYears={data.distinct.publishedYears}
      distinctKinds={data.distinct.kinds}
      initialSort="year-published-asc"
      toggleReviewed={true}
    >
      <Box textAlign="center" lineHeight={36}>
        <Link to="/shelf/">Shelf</Link> /{" "}
        <Link to={`/shelf/authors/`}>Authors</Link>
      </Box>
      <Spacer axis="vertical" size={16} />
      <Box display="flex" flexDirection="column" alignItems="center">
        <GraphqlImage
          image={data.author.avatar}
          alt={data.author.name}
          borderRadius="half"
          transform="safariBorderRadiusFix"
          // className={avatarStyle}
        />
      </Box>
      <Spacer axis="vertical" size={16} />
      <PageTitle textAlign="center">{data.author.name}</PageTitle>
      <Spacer axis="vertical" size={24} />
      <Box
        color="subtle"
        textAlign="center"
      >{`Author of ${data.author.works.length} works on the shelf.`}</Box>
    </CoverListWithFilters>
  );
}

export const pageQuery = graphql`
  query AuthorTemplate($id: String!) {
    author: shelfAuthor(id: $id) {
      name
      sortName
      avatar {
        childImageSharp {
          gatsbyImageData(
            layout: FIXED
            formats: [JPG, AVIF]
            quality: 80
            width: 200
            height: 200
            placeholder: BLURRED
          )
        }
      }
      works {
        title
        yearPublished
        kind
        slug
        sortTitle
        cover {
          ...CoverListCover
        }
      }
    }
    distinct: allAuthorsJson(
      filter: { id: { eq: $id }, works: { elemMatch: { id: { ne: null } } } }
    ) {
      publishedYears: distinct(field: { works: { yearPublished: SELECT } })
      kinds: distinct(field: { works: { kind: SELECT } })
    }
  }
`;
