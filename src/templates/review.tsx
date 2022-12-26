import { graphql, Link } from "gatsby";
import { Box } from "../components/Box";
import { Grade } from "../components/Grade";
import { GraphqlImage } from "../components/GraphqlImage";
import { HeadBuilder } from "../components/HeadBuilder";
import { Layout } from "../components/Layout";
import { LongFormText } from "../components/LongFormText";
import { PageTitle } from "../components/PageTitle";
import { ReadingHistory } from "../components/ReadingHistory";
import { Spacer } from "../components/Spacer";
import { toSentenceArray } from "../utils/";

function buildStructuredData(data: Queries.ReviewTemplateQuery) {
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
      image: data.work.seoImage.childImageSharp.resize.src,
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

function AuthorLink({ author }: { author: Author }): JSX.Element {
  let notes = null;

  if (author.notes) {
    notes = <> ({author.notes})</>;
  }

  return (
    <>
      <Link key={author.slug} to={`/shelf/authors/${author.slug}/`}>
        {author.name}
      </Link>
      {notes}
    </>
  );
}

function ReadingTime({ review }: { review: Review }): JSX.Element {
  const verb = review.isAudiobook ? "Listened to" : "Read";

  if (review.readingTime === 1) {
    return (
      <>
        <dt>{`${verb} on`}</dt>
        <dd>{review.dateFinishedPretty}</dd>
      </>
    );
  }

  return (
    <>
      <dt>{`${verb} Over`}</dt>
      <dd>
        {review.readingTime}
        {" Days"}
        <div>
          <div>
            {review.timeline[0].date}
            {" – "}
            <span>Started</span>
          </div>
          {review.timeline.map((entry, index) => {
            return (
              <div key={entry.date}>
                {entry.date}
                {" – "}
                {index === review.timeline.length - 1 ? (
                  <span>{entry.progress}</span>
                ) : (
                  `${entry.progress}`
                )}
              </div>
            );
          })}
        </div>
      </dd>
    </>
  );
}

export function Head({ data }: { data: PageQueryResult }): JSX.Element {
  const { work } = data;
  const authorNames = toSentenceArray(
    work.authors.map((author) => author.name)
  ).join(", ");

  return (
    <HeadBuilder
      pageTitle={`${work.title} by ${authorNames}`}
      description={`A review of the ${work.year} ${work.kind} by ${authorNames}.`}
      image={work.seoImage.childImageSharp.resize.src}
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

  return (
    <Layout>
      <Box
        as="main"
        id="top"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box
          as="header"
          display="flex"
          flexDirection="column"
          alignItems="center"
          paddingX="pageMargin"
          paddingY={{ default: 24, desktop: 32 }}
        >
          <GraphqlImage
            image={work.cover}
            alt={`A cover of ${work.title} by ${toSentenceArray(
              work.authors.map((a) => a.name)
            ).join("")} (${work.yearPublished})`}
            loading={"eager"}
          />
          <Spacer axis="vertical" size={24} />
          <Box as="h2">
            <PageTitle>{work.title}</PageTitle>
            {work.subtitle && <div>{work.subtitle}</div>}
          </Box>
          <Spacer axis="vertical" size={16} />
          <Box fontSize="medium">
            by{" "}
            {toSentenceArray(
              work.authors.map((author) => (
                <AuthorLink key={author.slug} author={author} />
              ))
            )}
          </Box>
          <Spacer axis="vertical" size={8} />
          <Box textTransform="uppercase" color="subtle" letterSpacing={1}>
            <Box as="span" letterSpacing={0.25}>
              {work.yearPublished}
            </Box>{" "}
            | {work.kind}
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" rowGap={32}>
          <Box display="flex" flexDirection="column" alignItems="center">
            {work.grade && <Grade grade={work.grade} height={32} />}
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
          <LongFormText
            maxWidth="prose"
            // eslint-disable-next-line react/no-danger
            text={work.review.linkedHtml}
          />
        </Box>
        <ReadingHistory work={work} maxWidth="popout" width="full" />
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
      review {
        linkedHtml
        date(formatString: "ddd MMM DD, YYYY")
      }
      readings {
        sequence
        edition
        timeline {
          date(formatString: "DD MMM, YYYY")
          progress
        }
        isAudiobook
        editionNotes
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
            width: 250
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
