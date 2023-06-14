import { graphql } from "gatsby";
import { IBoxProps } from "../Box";
import { GraphqlImage, IGraphqlImage } from "../GraphqlImage";
import { Link } from "../Link";

interface IListItemCoverProps extends IBoxProps {
  slug: string | null | undefined;
  image: IGraphqlImage;
  title: string;
}

export function ListItemCover({
  slug,
  image,
  title,
  ...rest
}: IListItemCoverProps) {
  const props = {
    overflow: "hidden",
    transform: "safariBorderRadiusFix",
    boxShadow: "borderAll",
    borderRadius: 8,
    maxWidth: 72,
    minWidth: 72,
    ...rest,
  } as const;

  if (slug) {
    return (
      <Link to={`/reviews/${slug}/`} {...props}>
        <GraphqlImage image={image} alt={`A cover from ${title}`} />
      </Link>
    );
  }

  return <GraphqlImage image={image} alt="An unreviewed title." {...props} />;
}

export const query = graphql`
  fragment ListItemCover on File {
    childImageSharp {
      gatsbyImageData(
        layout: FIXED
        formats: [JPG, AVIF]
        quality: 80
        width: 72
        placeholder: NONE
      )
    }
  }
`;
