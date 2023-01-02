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

function KindAndEdition({
  kind,
  edition,
}: {
  kind?: string | null;
  edition?: string | null;
}): JSX.Element | null {
  if (kind) {
    return (
      <>
        <Box className={slugTypographyStyle}>{kind}</Box>
      </>
    );
  }

  if (edition) {
    return (
      <>
        <Spacer axis="vertical" size={8} />
        <Box className={slugTypographyStyle}>{edition}</Box>
      </>
    );
  }

  return null;
}

interface IImageProps extends IBoxProps {
  slug: string | null | undefined;
  image: IGraphqlImage;
  title: string;
  year: number;
}

function Image({ slug, image, title, year, ...rest }: IImageProps) {
  if (slug) {
    return (
      <Link
        className={posterStyle}
        overflow="hidden"
        to={`/reviews/${slug}/`}
        transform="safariBorderRadiusFix"
        {...rest}
      >
        <GraphqlImage image={image} alt={`A poster from ${title} (${year})`} />
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
  year,
  slug,
}: {
  title: string;
  year: number;
  slug: string | null | undefined;
}) {
  const yearBox = (
    <Box as="span" fontSize="xSmall" color="subtle" fontWeight="light">
      &nbsp;{year}
    </Box>
  );

  if (slug)
    return (
      <Link
        to={`/reviews/${slug}/`}
        className={titleTypographyStyle}
        display="block"
      >
        {title}
        {yearBox}
      </Link>
    );

  return (
    <Box className={titleTypographyStyle}>
      {title}
      {yearBox}
    </Box>
  );
}

function Authors({ authors }: { authors: Author[] }) {
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
  dateFinished,
  kind,
  edition,
  authors,
  details,
}: {
  slug?: string | null;
  image: IGraphqlImage;
  title: string;
  year: number;
  grade?: string | null;
  dateFinished?: string;
  edition?: string | null;
  kind?: string | null;
  details?: React.ReactNode;
  authors?: readonly Author[];
}): JSX.Element {
  return (
    <Box
      as="li"
      flexDirection={{ default: "row", tablet: "column" }}
      columnGap={24}
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
      <Box flexGrow={1} width={{ tablet: "full" }}>
        <Title title={title} year={year} slug={slug} />
        <Spacer axis="vertical" size={4} />
        <KindAndEdition kind={kind} edition={edition} />
        <Spacer axis="vertical" size={4} />

        {authors && <Authors authors={authors} />}
        <Spacer axis="vertical" size={4} />
        <Box
          color="subtle"
          display="flex"
          flexDirection="column"
          className={slugTypographyStyle}
          fontWeight="light"
          letterSpacing={0.5}
          alignItems={{ default: "flex-start", tablet: "center" }}
        >
          {grade && (
            <Box
              // height={{ default: 16, tablet: 24 }}
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              {/* {!kind && !edition && !details && (
                <Spacer axis="vertical" size={{ default: 4, tablet: 0 }} />
              )} */}
              <>
                <Spacer axis="vertical" size={4} />
                <Grade grade={grade} height={16} />
              </>
            </Box>
          )}
          <Box>
            {/* <Spacer axis="vertical" size={8} /> */}
            {dateFinished && (
              <>
                <Spacer axis="vertical" size={4} />
                <Box>{dateFinished}</Box>
              </>
            )}
          </Box>
        </Box>
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
