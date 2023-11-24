import { graphql } from "gatsby";
import { Box } from "../Box";
import { Link } from "../Link";
import { ListItem } from "../ListItem";
import { ListItemCover } from "../ListItemCover";
import { ListItemTitle } from "../ListItemTitle";
import { Spacer } from "../Spacer";
import {
  detailsRowGridStyle,
  stickyHeaderStyle,
  stickyRowHeaderStyle,
} from "./MostReadAuthors.css";
import { StatHeading } from "./StatHeading";

export function MostReadAuthors({
  authors,
}: {
  authors: readonly Queries.MostReadAuthorFragment[];
}): JSX.Element | null {
  if (authors.length === 0) {
    return null;
  }

  return (
    <Box as="section" boxShadow="borderAll">
      <StatHeading>Most Read Authors</StatHeading>
      <Box
        as="header"
        backgroundColor="default"
        display="flex"
        justifyContent="space-between"
        paddingX="gutter"
        className={stickyHeaderStyle}
        fontWeight="bold"
      >
        <Box as="span" textAlign="left" lineHeight={40}>
          Name
        </Box>
        <Box as="span" textAlign="right" lineHeight={40}>
          Readings
        </Box>
      </Box>
      <Box as="ol">
        {authors.map((author, index) => {
          return (
            <Box as="li" key={author.name} display="block">
              <Box
                className={stickyRowHeaderStyle}
                style={{ zIndex: 200 + index }}
                paddingX="gutter"
                backgroundColor="stripe"
              >
                <Box as="span" lineHeight={40}>
                  <Link to={`/reviews/authors/${author.slug}`}>
                    {author.name}
                  </Link>
                </Box>
                <Box as="span" lineHeight={40}>
                  &nbsp;
                </Box>
                <Box
                  as="span"
                  lineHeight={40}
                  backgroundColor="stripe"
                  textAlign="right"
                >
                  {author.count}
                </Box>
              </Box>
              <Box lineHeight={40} className={detailsRowGridStyle}>
                <details>
                  <Box
                    as="summary"
                    color="subtle"
                    letterSpacing={0.25}
                    paddingX="gutter"
                  >
                    Details
                  </Box>
                  <Box as="ol" paddingX={{ default: 0, tablet: "gutter" }}>
                    {author.readings.map((reading) => {
                      return (
                        <MostWatchedAuthorReadingListItem
                          key={reading.sequence}
                          reading={reading}
                        />
                      );
                    })}
                  </Box>
                </details>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export function MostWatchedAuthorReadingListItem({
  reading,
}: {
  reading: Queries.MostReadAuthorReadingFragment;
}) {
  return (
    <ListItem alignItems="center">
      <ListItemCover
        slug={reading.slug}
        image={reading.cover}
        title={reading.title}
        flexShrink={0}
        boxShadow="borderAll"
      />
      <Box flexGrow={1}>
        <ListItemTitle title={reading.title} slug={reading.slug} />
        <Spacer axis="vertical" size={8} />
        <ListItemYearAndKind year={reading.yearPublished} kind={reading.kind} />
        <Spacer axis="vertical" size={8} />
        <Spacer axis="vertical" size={4} />
        <Box
          color="subtle"
          fontSize="default"
          // letterSpacing={0.5}
          lineHeight={16}
        >
          {reading.edition} on {reading.date}
        </Box>
        <Spacer axis="vertical" size={4} />
      </Box>
    </ListItem>
  );
}

function ListItemYearAndKind({
  kind,
  year,
}: {
  kind: string;
  year: string;
}): JSX.Element | null {
  return (
    <Box color="subtle" fontSize="small" letterSpacing={0.5} lineHeight={16}>
      <Box as="span">{kind} | </Box>
      {year}
    </Box>
  );
}

export const query = graphql`
  fragment MostReadAuthorReading on ReadingStatsJsonMostReadAuthorReading {
    sequence
    date(formatString: "MMMM D, YYYY")
    slug
    edition
    kind
    title
    yearPublished
    cover {
      ...CoverGalleryCover
    }
  }

  fragment MostReadAuthor on ReadingStatsJsonMostReadAuthor {
    name
    slug
    count
    readings {
      ...MostReadAuthorReading
    }
  }
`;
