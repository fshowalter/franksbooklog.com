import { graphql, Link } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import toSentenceArray from "../../utils/to-sentence-array";
import Grade from "../Grade";
import Layout from "../Layout";
import RenderedMarkdown from "../RenderedMarkdown";
import Seo from "../Seo";

import {
  authorLinkCss,
  containerCss,
  coverCss,
  headerAuthorCss,
  headerContainerCss,
  headerKindCss,
  headerSubtitleCss,
  headerTitleCss,
  headerYearCss,
  progressContainerCss,
  progressMilestoneCss,
  readingTimeContainerCss,
  reviewAbandonedCss,
  reviewContentCss,
  reviewCss,
  reviewGradeCss,
  reviewMetaCss,
  reviewsListCss,
  reviewsListItemCss,
  slugContainerCss,
  slugDateCss,
  slugOnCss,
  termCss,
} from "./ReviewPage.module.scss";

function buildStructuredData(pageData: PageQueryResult) {
  if (!pageData.work.lastReviewGrade) {
    return null;
  }

  const gradeMap: { [index: string]: number } = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
    F: 1,
  };

  return {
    "@context": "http://schema.org",
    "@type": "AggregateRating",
    itemReviewed: {
      "@type": "Book",
      name: pageData.work.title,
      image: pageData.work.seoImage.childImageSharp.resize.src,
    },
    reviewCount: pageData.work.reviews.length,
    ratingValue: gradeMap[pageData.work.lastReviewGrade[0]],
  };
}

function AuthorLink({ author }: { author: Author }): JSX.Element {
  let notes = null;

  if (author.notes) {
    notes = <> ({author.notes})</>;
  }

  return (
    <>
      <Link
        key={author.slug}
        className={authorLinkCss}
        to={`/shelf/authors/${author.slug}/`}
      >
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
        <dt className={termCss}>{`${verb} on`}</dt>
        <dd>{review.dateFinishedPretty}</dd>
      </>
    );
  }

  return (
    <>
      <dt className={termCss}>{`${verb} Over`}</dt>
      <dd className={readingTimeContainerCss}>
        {review.readingTime}
        {" Days"}
        <div className={progressContainerCss}>
          <div>
            {review.frontmatter.timeline[0].date}
            {" – "}
            <span className={progressMilestoneCss}>Started</span>
          </div>
          {review.frontmatter.timeline.map((entry, index) => {
            return (
              <div key={entry.date}>
                {entry.date}
                {" – "}
                {index === review.frontmatter.timeline.length - 1 ? (
                  <span className={progressMilestoneCss}>{entry.progress}</span>
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

/**
 * Renders a review page.
 */
export default function ReviewPage({
  data,
}: {
  data: PageQueryResult;
}): JSX.Element {
  const structuredData = buildStructuredData(data);
  const { work } = data;
  const authorNames = toSentenceArray(
    work.authors.map((author) => author.name)
  ).join(", ");

  return (
    <Layout>
      <Seo
        pageTitle={`${work.title} by ${authorNames}`}
        description={`A review of the ${work.year} ${work.kind} by ${authorNames}.`}
        image={work.seoImage.childImageSharp.resize.src}
        article
      />
      <main id="top" className={containerCss}>
        <header className={headerContainerCss}>
          <div className={headerTitleCss}>
            {work.title}
            {work.subtitle && (
              <div className={headerSubtitleCss}>{work.subtitle}</div>
            )}
          </div>

          <div className={headerAuthorCss}>
            by{" "}
            {toSentenceArray(
              work.authors.map((author) => (
                <AuthorLink key={author.slug} author={author} />
              ))
            )}
          </div>
          <div className={headerKindCss}>
            <span className={headerYearCss}>{work.year}</span> | {work.kind}
          </div>
          {work.cover && (
            <GatsbyImage
              image={work.cover.childImageSharp.gatsbyImageData}
              alt={`A still from ${work.title} by ${toSentenceArray(
                work.authors.map((a) => a.name)
              ).join("")} (${work.year})`}
              loading={"eager"}
              className={coverCss}
            />
          )}
        </header>
        <ul className={reviewsListCss}>
          {work.reviews.map((review) => (
            <li
              className={reviewsListItemCss}
              key={review.frontmatter.sequence}
            >
              <article className={reviewCss}>
                <header
                  className={slugContainerCss}
                  id={review.frontmatter.sequence.toString()}
                >
                  {review.frontmatter.grade ? (
                    <Grade
                      grade={review.frontmatter.grade}
                      className={reviewGradeCss}
                    />
                  ) : (
                    <span className={reviewAbandonedCss}>Abandoned</span>
                  )}

                  <div>
                    <span className={slugOnCss}> on </span>
                    <span className={slugDateCss}>{review.dateFinished}</span>
                  </div>
                </header>
                <RenderedMarkdown
                  className={reviewContentCss}
                  // eslint-disable-next-line react/no-danger
                  text={review.linkedHtml}
                />
                <aside className={reviewMetaCss}>
                  <div>
                    <dl>
                      <dt className={termCss}>Edition</dt>
                      <dd>
                        {review.frontmatter.edition} (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: review.editionNotesHtml,
                          }}
                        />
                        )
                      </dd>
                      <ReadingTime review={review} />
                    </dl>
                  </div>
                </aside>
              </article>
            </li>
          ))}
        </ul>
      </main>
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

interface PageQueryResult {
  work: Work;
}

interface Author {
  name: string;
  slug: string;
  notes: string | null;
}

interface Review {
  frontmatter: {
    grade: string | null;
    edition: string;
    sequence: number;
    timeline: {
      date: string;
      progress: number | string;
    }[];
  };
  editionNotesHtml: string;
  readingTime: number;
  isAudiobook: boolean;
  linkedHtml: string;
  dateFinished: string;
  dateFinishedIso: string;
  dateFinishedPretty: string;
}

export interface Work {
  title: string;
  subtitle: string | null;
  year: number;
  kind: string;
  lastReviewGrade: string | null;
  authors: Author[];
  cover: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData;
    };
  };
  seoImage: {
    childImageSharp: {
      resize: {
        src: string;
      };
    };
  };
  reviews: Review[];
}

export const pageQuery = graphql`
  query ($slug: String!) {
    work: worksJson(slug: { eq: $slug }) {
      title
      subtitle
      year
      kind
      lastReviewGrade
      authors {
        name
        notes
        slug
      }
      reviews {
        frontmatter {
          grade
          sequence
          edition
          timeline {
            date(formatString: "DD MMM, YYYY")
            progress
          }
        }
        isAudiobook
        editionNotesHtml
        readingTime
        dateFinished(formatString: "DD MMM, YYYY")
        dateFinishedIso: dateFinished(formatString: "Y-MM-DD")
        dateFinishedPretty: dateFinished(formatString: "dddd MMMM D, YYYY")
        linkedHtml
      }
      cover {
        childImageSharp {
          gatsbyImageData(
            layout: FIXED
            formats: [JPG, AVIF]
            quality: 80
            width: 250
            placeholder: TRACED_SVG
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
