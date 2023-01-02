import { graphql } from "gatsby";
import { AuthorLink } from "../components/AuthorLink";
import { Box } from "../components/Box";
import { Grade } from "../components/Grade";
import { GraphqlImage } from "../components/GraphqlImage";
import { HeadBuilder } from "../components/HeadBuilder";
import { Layout } from "../components/Layout";
import { Link } from "../components/Link";
import { LongFormText } from "../components/LongFormText";
import { MoreReviewsNav } from "../components/MoreReviews";
import { MoreReviews } from "../components/MoreReviews/MoreReviews";
import { MoreReviewsHeading } from "../components/MoreReviews/MoreReviewsHeading";
import { PageTitle } from "../components/PageTitle";
import { ReadingHistory } from "../components/ReadingHistory";
import { Spacer } from "../components/Spacer";
import { toSentenceArray } from "../utils/";

function buildStructuredData(data: Queries.ReviewTemplateQuery) {
  if (!data.work.grade) {
    return null;
  }

  const gradeMap: Record<string, number> = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
    F: 1,
  };

  return {
    "@context": "http://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Book",
      name: data.work.title,
      image: data.work.seoImage.childImageSharp?.resize?.src,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: gradeMap[data.work.grade[0]],
    },
    author: {
      "@type": "Person",
      name: "Frank Showalter",
    },
  };
}

export function Head({
  data,
}: {
  data: Queries.ReviewTemplateQuery;
}): JSX.Element {
  const { work } = data;
  const authorNames = toSentenceArray(
    work.authors.map((author) => author.name)
  ).join(", ");

  return (
    <HeadBuilder
      pageTitle={`${work.title} by ${authorNames}`}
      description={`A review of the ${work.yearPublished} ${work.kind} by ${authorNames}.`}
      image={work.seoImage.childImageSharp?.resize?.src}
      article
    />
  );
}

/**
 * Renders a review page.
 */
export default function ReviewPage({
  data,
}: {
  data: Queries.ReviewTemplateQuery;
}): JSX.Element {
  const structuredData = buildStructuredData(data);
  const { work } = data;

  const grade = work.grade ? (
    <Grade grade={work.grade} height={32} />
  ) : (
    <Box
      fontSize="medium"
      textTransform="uppercase"
      letterSpacing={1}
      color="emphasis"
    >
      Abandoned
    </Box>
  );

  return (
    <Layout>
      <Box
        as="main"
        id="top"
        display="flex"
        flexDirection="column"
        alignItems="center"
        paddingTop={{ default: 24, desktop: 48 }}
      >
        <Box
          as="header"
          display="flex"
          flexDirection="column"
          alignItems="center"
          paddingX="pageMargin"
        >
          <Box as="h2" textAlign="center">
            <PageTitle>{work.title}</PageTitle>
            {work.subtitle && (
              <>
                <Spacer axis="vertical" size={16} />
                <Box
                  fontSize="medium"
                  fontWeight="normal"
                  letterSpacing={0.25}
                  color="muted"
                  maxWidth="prose"
                >
                  {work.subtitle}
                </Box>
              </>
            )}
          </Box>
          <Spacer axis="vertical" size={8} />
          <Box textTransform="uppercase" color="subtle" letterSpacing={1}>
            <Box as="span" letterSpacing={0.25}>
              {work.yearPublished}
            </Box>{" "}
            | {work.kind}
          </Box>
          <Spacer axis="vertical" size={8} />
          <Box fontSize="medium">
            by{" "}
            {toSentenceArray(
              work.authors.map((author) => (
                <AuthorLink key={author.slug} author={author} />
              ))
            )}
          </Box>
          <Spacer axis="vertical" size={32} />
          <GraphqlImage
            image={work.cover}
            alt={`A cover of ${work.title} by ${toSentenceArray(
              work.authors.map((a) => a.name)
            ).join("")} (${work.yearPublished})`}
            loading={"eager"}
          />
        </Box>
        <Spacer axis="vertical" size={32} />
        <Box display="flex" flexDirection="column" paddingX="pageMargin">
          <Box display="flex" flexDirection="column" alignItems="center">
            {grade}
            <Box
              display="flex"
              flexDirection="column"
              color="subtle"
              alignItems="inherit"
              letterSpacing={0.5}
            >
              <span>on</span> {work.review.date}
            </Box>
          </Box>
          <Spacer axis="vertical" size={32} />
          <LongFormText
            maxWidth="prose"
            // eslint-disable-next-line react/no-danger
            text={work.review.linkedHtml}
          />
        </Box>
        {work.includedWorks.length > 0 && (
          <>
            <Spacer axis="vertical" size={64} />
            <Box
              as="h3"
              color="subtle"
              fontSize="medium"
              fontWeight="normal"
              paddingX="gutter"
              boxShadow="borderBottom"
              maxWidth="popout"
              width="full"
            >
              Included Works
              <Spacer size={8} axis="vertical" />
            </Box>
            <Box as="ul" width="full" maxWidth="popout">
              {work.includedWorks.map((includedWork) => (
                <Box
                  as="li"
                  key={includedWork.id}
                  display="flex"
                  flexDirection="column"
                  backgroundColor="zebra"
                  paddingX="gutter"
                  paddingY={16}
                >
                  <Link
                    to={`/reviews/${includedWork.slug}/`}
                    fontSize="medium"
                    fontWeight="semiBold"
                  >
                    {includedWork.title}
                  </Link>{" "}
                  <Box>
                    <Box as="span" color="subtle">
                      by
                    </Box>{" "}
                    {toSentenceArray(
                      includedWork.authors.map((author) => author.name)
                    )}
                  </Box>
                  <Grade grade={includedWork.grade} height={16} />
                </Box>
              ))}
            </Box>
          </>
        )}
        <Spacer axis="vertical" size={80} />
        <ReadingHistory work={work} maxWidth="popout" width="full" />
        <Spacer axis="vertical" size={128} />
        <Box
          display="flex"
          flexDirection="column"
          rowGap={{ default: 48, desktop: 96 }}
          alignItems="center"
          backgroundColor={{ default: "default", tablet: "subtle" }}
          paddingTop={{ default: 0, tablet: 32 }}
          paddingBottom={{ default: 0, tablet: 128 }}
          width="full"
        >
          <MoreReviewsNav>
            <MoreReviewsHeading
              leadText="More"
              linkText="Reviews"
              linkTarget="/reviews/"
            />
            <MoreReviews
              works={work.browseMore}
              seeAllLinkText="Reviews"
              seeAllLinkTarget="/reviews/"
            />
          </MoreReviewsNav>
        </Box>
      </Box>
      {structuredData && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Layout>
  );
}

export const pageQuery = graphql`
  query ReviewTemplate($id: String!) {
    work: reviewedWork(id: $id) {
      ...ReadingHistory
      title
      subtitle
      yearPublished
      kind
      grade
      authors {
        name
        notes
        slug
      }
      includedWorks {
        id
        title
        authors {
          name
          slug
        }
        grade
        slug
      }
      browseMore {
        ...MoreReviews
      }
      review {
        linkedHtml
        date(formatString: "ddd MMM DD, YYYY")
      }
      readings {
        readingTime
        dateFinishedIso: dateFinished(formatString: "Y-MM-DD")
        dateFinishedPretty: dateFinished(formatString: "dddd MMMM D, YYYY")
      }
      cover {
        childImageSharp {
          gatsbyImageData(
            layout: FIXED
            formats: [JPG, AVIF]
            quality: 80
            width: 248
            placeholder: BLURRED
          )
        }
      }
      seoImage: cover {
        childImageSharp {
          resize(toFormat: JPG, width: 1200, quality: 80) {
            src
          }
        }
      }
    }
  }
`;
