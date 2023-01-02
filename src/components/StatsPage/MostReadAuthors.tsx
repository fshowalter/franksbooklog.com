import { graphql } from "gatsby";
import { Box } from "../Box";
import { Cover, CoverList } from "../CoverList";
import { Link } from "../Link";
import { Spacer } from "../Spacer";
import { StatHeading } from "../StatHeading";
import {
  detailsRowGridStyle,
  stickyHeaderStyle,
  stickyRowHeaderStyle,
} from "./MostReadAuthors.css";

function AuthorName({
  author,
}: {
  author: Queries.MostReadAuthorFragment;
}): JSX.Element {
  if (author.slug) {
    return <Link to={`/shelf/authors/${author.slug}/`}>{author.name}</Link>;
  }

  return <>{author.name}</>;
}

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
          Viewings
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
                  <AuthorName author={author} />
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
                  <CoverList paddingX={{ default: 0, tablet: "gutter" }}>
                    {author.readings.map((reading) => {
                      return (
                        <Cover
                          key={reading.sequence}
                          image={reading.cover}
                          title={reading.title}
                          slug={reading.work.slug}
                          year={reading.yearPublished}
                          date={reading.dateFinished}
                          edition={reading.edition}
                          kind={reading.kind}
                        />
                      );
                    })}
                  </CoverList>
                  <Spacer axis="vertical" size={{ default: 0, tablet: 32 }} />
                </details>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export const query = graphql`
  fragment MostReadAuthor on MostReadAuthor {
    name
    slug
    count
    readings {
      sequence
      dateFinished(formatString: "ddd MMM D, YYYY")
      work {
        slug
      }
      edition
      kind
      title
      yearPublished
      cover {
        ...CoverListCover
      }
    }
  }
`;
