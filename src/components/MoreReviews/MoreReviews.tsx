import { graphql } from "gatsby";
import { Box } from "../Box";
import { Cover, CoverList } from "../CoverList";
import { Link } from "../Link";
import { gridStyle, seeAllLinkStyle } from "./MoreReviews.css";

export function MoreReviews({
  works,
  seeAllLinkTarget,
  seeAllLinkText,
}: {
  works: readonly Queries.MoreReviewsFragment[];
  seeAllLinkText: string;
  seeAllLinkTarget: string;
}): JSX.Element | null {
  if (works.length < 4) {
    return null;
  }

  return (
    <CoverList paddingX={0} width="full" className={gridStyle}>
      {works.map((work) => {
        return (
          <Cover
            key={work.id}
            title={work.title}
            grade={work.grade}
            slug={work.slug}
            image={work.cover}
            authors={work.authors}
            image={work.cover}
          />
        );
      })}
      <Box
        as="li"
        display="block"
        textAlign="right"
        paddingX={{ default: "gutter", tablet: 0 }}
        className={seeAllLinkStyle}
        paddingY={16}
        boxShadow={{ default: "borderBottom", tablet: "unset" }}
      >
        <Link to={seeAllLinkTarget}>
          All{" "}
          <Box
            as="span"
            display={{ default: "inline", tablet: "none", desktop: "inline" }}
          >
            {seeAllLinkText}
          </Box>{" "}
          &#8594;
        </Link>
      </Box>
    </CoverList>
  );
}

export const query = graphql`
  fragment MoreReviews on WorksJson {
    id
    title
    authors {
      name
    }
    grade
    slug
    cover {
      ...CoverListCover
    }
  }
`;
