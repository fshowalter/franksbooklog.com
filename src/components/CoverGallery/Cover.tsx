import { graphql } from "gatsby";
import { toSentenceArray } from "../../utils";
import { Box, IBoxProps } from "../Box";
import { Grade } from "../Grade";
import { GraphqlImage, IGraphqlImage } from "../GraphqlImage";
import { Link } from "../Link";
import { ListItemTitle } from "../ListItemTitle";
import { Spacer } from "../Spacer";
import {
  posterStyle,
  slugTypographyStyle,
  titleTypographyStyle,
} from "./Cover.css";

export function Cover({
  slug,
  image,
  title,
  year,
  grade,
  date,
  kind,
  edition,
  authors,
  details,
}: {
  slug: string;
  image: IGraphqlImage;
  title: string;
  year: number;
  grade?: string;
  date?: string;
  edition?: string | null;
  kind?: string | null;
  details?: React.ReactNode;
  authors?: readonly Author[];
}): JSX.Element {
  return (
    <Box
      as="li"
      flexDirection={{ default: "row", tablet: "column" }}
      columnGap={16}
      backgroundColor={{ default: "zebra", tablet: "zebraOff" }}
      paddingX={{ default: "gutter", tablet: 0 }}
      paddingY={{ default: 16, tablet: 0 }}
      alignItems={{ default: "center", tablet: "flex-start" }}
      display="flex"
    >
      <Image
        slug={slug}
        image={image}
        title={title}
        year={year}
        flexShrink={0}
      />
      <Spacer axis="vertical" size={{ default: 0, tablet: 8 }} />
      <Box
        flexGrow={1}
        width={{ tablet: "full" }}
        display="flex"
        flexDirection="column"
        alignItems={{ tablet: "center" }}
      >
        <Spacer axis="vertical" size={{ default: 0, tablet: 4 }} />
        <ListItemTitle
          title={title}
          slug={slug}
          className={titleTypographyStyle}
        />
        <Spacer axis="vertical" size={{ default: 4, tablet: 8 }} />
        <Authors
          authors={authors}
          textAlign={{ default: "left", tablet: "center" }}
        />
        <Spacer axis="vertical" size={8} />
        <YearAndKind
          workKind={kind}
          year={year}
          textAlign={{ default: "left", tablet: "center" }}
        />
        <Spacer axis="vertical" size={8} />
        {grade && (
          <>
            <Grade grade={grade} height={16} />
            <Spacer axis="vertical" size={8} />
          </>
        )}
        {date && (
          <>
            <Box color="subtle" className={slugTypographyStyle}>
              {date}
            </Box>
            <Spacer axis="vertical" size={{ default: 8, tablet: 4 }} />
          </>
        )}
        {edition && (
          <>
            <Box color="subtle" className={slugTypographyStyle}>
              {edition}
            </Box>
            <Spacer axis="vertical" size={{ default: 8, tablet: 4 }} />
          </>
        )}
        {details && details}
      </Box>
    </Box>
  );
}

interface IYearAndKindProps extends IBoxProps {
  workKind?: string | null;
  year?: number | null;
}

function YearAndKind({
  workKind,
  year,
  ...rest
}: IYearAndKindProps): JSX.Element | null {
  const yearBox = year ? <Box as="span">{year} | </Box> : null;

  if (workKind) {
    return (
      <Box
        fontSize="small"
        color="subtle"
        letterSpacing={0.5}
        lineHeight={16}
        {...rest}
      >
        {yearBox}
        {workKind}
      </Box>
    );
  }

  return null;
}

interface IImageProps extends IBoxProps {
  slug: string | null | undefined;
  image: IGraphqlImage;
  title: string;
  year?: number;
}

function Image({ slug, image, title, ...rest }: IImageProps) {
  if (slug) {
    return (
      <Link
        className={posterStyle}
        overflow="hidden"
        to={`/reviews/${slug}/`}
        transform="safariBorderRadiusFix"
        {...rest}
      >
        <GraphqlImage image={image} alt={`A cover from ${title}`} />
      </Link>
    );
  }

  return (
    <GraphqlImage
      image={image}
      alt="An unreviewed title."
      className={posterStyle}
      overflow="hidden"
      transform="safariBorderRadiusFix"
    />
  );
}

interface IAuthorsProps extends IBoxProps {
  authors: readonly Author[] | undefined;
}

function Authors({ authors, ...rest }: IAuthorsProps) {
  if (!authors) {
    return null;
  }

  return (
    <Box color="muted" fontSize="default" lineHeight={20} {...rest}>
      {toSentenceArray(authors.map((author) => author.name))}
    </Box>
  );
}

interface Author {
  name: string;
}

export const query = graphql`
  fragment CoverGalleryCover on File {
    childImageSharp {
      gatsbyImageData(
        layout: CONSTRAINED
        formats: [JPG, AVIF]
        quality: 80
        width: 248
        placeholder: NONE
      )
    }
  }
`;
