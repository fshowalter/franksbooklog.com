import { graphql } from "gatsby";
import { toSentenceArray } from "../../utils";
import { AuthorLink } from "../AuthorLink";
import { Box, IBoxProps } from "../Box";
import { Grade } from "../Grade";
import { GraphqlImage } from "../GraphqlImage";
import { gridAreaComponent, gridComponent } from "../Grid";
import { Link } from "../Link";
import { RenderedMarkdown } from "../RenderedMarkdown";
import { Spacer } from "../Spacer";
import {
  coverBorderStyle,
  excerptContinueReadingLinkStyle,
  gridAreas,
  gridStyle,
} from "./ListItem.css";

const GridArea = gridAreaComponent(gridAreas);

const Grid = gridComponent(gridStyle);

interface IHomePageItemProps extends IBoxProps {
  item: Queries.HomeListItemFragment;
  counterValue: number;
  eagerLoadCoverImage: boolean;
}

export function ListItem({
  item,
  counterValue,
  eagerLoadCoverImage,
}: IHomePageItemProps): JSX.Element {
  return (
    <Box as="li" value={counterValue} display="flex" backgroundColor="zebra">
      <Grid as="article" paddingX="pageMargin">
        <GridArea
          name="date"
          textTransform="uppercase"
          fontSize="small"
          fontWeight="light"
          letterSpacing={0.75}
          lineHeight={16}
          color="subtle"
        >
          {item.date}
        </GridArea>
        <GridArea name="cover" maxWidth="prose">
          <Link
            rel="canonical"
            to={`/reviews/${item.slug}/`}
            className={coverBorderStyle}
            display="block"
          >
            <GraphqlImage
              image={item.cover}
              alt={`A cover of ${item.title} by ${toSentenceArray(
                item.authors.map((a) => a.name),
              ).join("")}`}
              loading={eagerLoadCoverImage ? "eager" : "lazy"}
            />
          </Link>
        </GridArea>
        <GridArea name="excerpt">
          <Box
            display="flex"
            flexDirection="column"
            alignItems={{ default: "center", desktop: "flex-start" }}
          >
            <Box
              textTransform="uppercase"
              fontSize="small"
              fontWeight="light"
              letterSpacing={0.75}
              lineHeight={16}
              color="subtle"
            >
              {item.yearPublished} | {item.kind}
            </Box>
            <Spacer axis="vertical" size={16} />
            <Box
              as="h2"
              fontWeight="bold"
              fontSize="large"
              lineHeight={32}
              textAlign="center"
            >
              <Link
                to={`/reviews/${item.slug}/`}
                rel="canonical"
                color="default"
                display="inline-block"
              >
                {item.title}
              </Link>
            </Box>
            <Box as="p" textAlign="center">
              by{" "}
              {toSentenceArray(
                item.authors.map((author) => {
                  return (
                    <AuthorLink as="span" key={author.slug} author={author} />
                  );
                }),
              )}
            </Box>{" "}
            <Spacer axis="vertical" size={16} />
            {item.grade && <Grade grade={item.grade} height={24} />}
            <Spacer axis="vertical" size={16} />
          </Box>
          <RenderedMarkdown
            text={item.review.excerptHtml}
            className={excerptContinueReadingLinkStyle}
          />
        </GridArea>
      </Grid>
    </Box>
  );
}

export const query = graphql`
  fragment HomeListItemAuthor on ReviewedWorksJsonWorkAuthor {
    name
    slug
    notes
  }

  fragment HomeListItem on ReviewedWorksJson {
    grade
    sequence
    slug
    date(formatString: "DD MMM YYYY")
    review {
      excerptHtml
    }
    title
    kind
    yearPublished
    authors {
      ...HomeListItemAuthor
    }
    cover {
      childImageSharp {
        gatsbyImageData(
          layout: FIXED
          formats: [JPG, AVIF]
          quality: 80
          width: 168
          placeholder: BLURRED
        )
      }
    }
  }
`;
