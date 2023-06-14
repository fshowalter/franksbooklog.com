import { graphql } from "gatsby";
import { Box } from "../Box";
import { Cover, CoverGallery } from "../CoverGallery";
import { Link } from "../Link";
import { Heading } from "./Heading";
import { gridStyle, seeAllLinkStyle } from "./MoreReviews.css";
import { Nav } from "./Nav";

export function MoreReviews({
  reviewedWorks,
  linkTarget,
  linkText,
}: {
  reviewedWorks: readonly Queries.MoreReviewsFragment[];
  linkText: string;
  linkTarget: string;
}): JSX.Element | null {
  if (reviewedWorks.length < 4) {
    return null;
  }

  return (
    <Nav>
      <Heading leadText="More" linkTarget={linkTarget} linkText={linkText} />
      <CoverGallery paddingX={0} width="full" className={gridStyle}>
        {reviewedWorks.map((work) => {
          return (
            <Cover
              key={work.id}
              title={work.title}
              grade={work.grade}
              slug={work.slug}
              image={work.cover}
              authors={work.authors}
              year={work.yearPublished}
              kind={work.kind}
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
          <Link to={linkTarget}>
            All{" "}
            <Box
              as="span"
              display={{ default: "inline", tablet: "none", desktop: "inline" }}
            >
              {linkText}
            </Box>{" "}
            &#8594;
          </Link>
        </Box>
      </CoverGallery>
    </Nav>
  );
}

export const query = graphql`
  fragment MoreReviews on ReviewedWorksJson {
    id
    title
    yearPublished
    kind
    authors {
      name
    }
    grade
    slug
    cover {
      ...CoverGalleryCover
    }
  }
`;
