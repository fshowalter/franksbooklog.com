import { graphql } from "gatsby";
import { composeClassNames } from "../../styles/composeClassNames";
import { toSentenceArray } from "../../utils";
import { Box, IBoxProps } from "../Box";
import { Grade } from "../Grade";
import { GraphqlImage, IGraphqlImage } from "../GraphqlImage";
import { Link } from "../Link";
import { Spacer } from "../Spacer";
import {
  authorsTypographyStyle,
  gridStyle,
  posterStyle,
  slugTypographyStyle,
  titleTypographyStyle,
} from "./CoverList.css";

function YearAndKind({
  kind,
  year,
}: {
  kind?: string | null;
  year?: number | null;
}): JSX.Element | null {
  const yearBox = year ? <Box as="span">{year} | </Box> : null;

  if (kind) {
    return (
      <Box className={slugTypographyStyle} color="subtle">
        {yearBox}
        {kind}
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

function Title({
  title,
  slug,
}: {
  title: string;
  slug: string | null | undefined;
}) {
  if (slug)
    return (
      <Link
        to={`/reviews/${slug}/`}
        className={titleTypographyStyle}
        display="block"
      >
        {title}
      </Link>
    );

  return <Box className={titleTypographyStyle}>{title}</Box>;
}

function Authors({ authors }: { authors: readonly Author[] }) {
  return (
    <Box color="muted" className={authorsTypographyStyle}>
      {toSentenceArray(authors.map((author) => author.name))}
    </Box>
  );
}

interface Author {
  name: string;
}

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
  slug?: string | null;
  image: IGraphqlImage;
  title: string;
  year?: number;
  grade?: string | null;
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
        <Title title={title} slug={slug} />
        <Spacer axis="vertical" size={{ default: 8, tablet: 4 }} />
        <YearAndKind kind={kind} year={year} />
        <Spacer axis="vertical" size={{ default: 4, tablet: 8 }} />

        {authors && <Authors authors={authors} />}
        <Spacer axis="vertical" size={{ default: 4, tablet: 8 }} />
        {grade && <Grade grade={grade} height={16} />}
        {/* <Spacer axis="vertical" size={8} /> */}
        {date && (
          <>
            <Spacer axis="vertical" size={8} />
            <Box color="subtle" className={slugTypographyStyle}>
              {date}
            </Box>
          </>
        )}
        {edition && (
          <>
            <Spacer axis="vertical" size={{ default: 8, tablet: 4 }} />
            <Box color="subtle" className={slugTypographyStyle}>
              {edition}
            </Box>
          </>
        )}
        {details && details}
      </Box>
    </Box>
  );
}

export function CoverList({
  children,
  className,
  ...rest
}: IBoxProps): JSX.Element {
  return (
    <Box
      as="ol"
      className={composeClassNames(gridStyle, className)}
      paddingX={0}
      {...rest}
    >
      {children}
    </Box>
  );
}

export const query = graphql`
  fragment CoverListCover on File {
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
