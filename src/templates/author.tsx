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

export function Slug({
  data,
}: {
  data: Queries.AuthorTemplateQuery;
}): JSX.Element {
  const shelfWorkCount =
    data.author.works.length - data.author.reviewedWorkCount;
  let shelfText = <></>;

  if (shelfWorkCount > 0) {
    shelfText = (
      <>
        , and{" "}
        <Box as="span" color="emphasis">
          {shelfWorkCount}
        </Box>{" "}
        titles on the shelf
      </>
    );
  }

  let works = "works";

  if (data.author.reviewedWorkCount === 1) {
    works = "work";
  }

  return (
    <Box color="subtle" textAlign="center">
      Author of{" "}
      <Box as="span" color="emphasis">
        {data.author.reviewedWorkCount}
      </Box>{" "}
      reviewed {works}
      {shelfText}.
    </Box>
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
        <Link to="/reviews/">Reviews</Link> /{" "}
        <Link to={`/reviews/authors/`}>Authors</Link>
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
      <Slug data={data} />
    </CoverListWithFilters>
  );
}

export const pageQuery = graphql`
  query AuthorTemplate($id: String!) {
    author: reviewedAuthor(id: $id) {
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
      reviewedWorkCount
      works {
        id
        title
        yearPublished
        kind
        slug
        sortTitle
        grade
        gradeValue
        cover {
          ...CoverGalleryCover
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
