import { graphql, Link } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";
import toSentenceArray from "../../utils/to-sentence-array";
import DateIcon from "../DateIcon";
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
  headerTitleCss,
  headerYearCss,
  progressContainerCss,
  progressMilestoneCss,
  readingTimeContainerCss,
  reviewContentCss,
  reviewCss,
  reviewDateIconCss,
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
          <div className={headerTitleCss}>{work.title}</div>
          <div className={headerAuthorCss}>
            By{" "}
            {work.authors.map((author) => {
              return (
                <Link
                  className={authorLinkCss}
                  to={`/shelf/authors/${author.slug}`}
                  key={author.slug}
                >
                  {author.name}
                </Link>
              );
            })}
          </div>
          <div className={headerKindCss}>{work.kind}</div>
          <div className={headerYearCss}>First published in {work.year}.</div>
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
                  <DateIcon className={reviewDateIconCss} />{" "}
                  <Grade
                    grade={review.frontmatter.grade}
                    className={reviewGradeCss}
                  />
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
                <aside id="credits" className={reviewMetaCss}>
                  <div>
                    <dl>
                      <dt className={termCss}>Edition</dt>
                      <dd>
                        {review.frontmatter.edition} (
                        {review.frontmatter.editionNotes})
                      </dd>
                      <dt className={termCss}>Reading Time</dt>
                      <dd className={readingTimeContainerCss}>
                        {review.readingTime}{" "}
                        {review.readingTime === 1 ? "Day" : "Days"}
                        <div className={progressContainerCss}>
                          <div>
                            {review.frontmatter.progress[0].date}
                            {" – "}
                            <span className={progressMilestoneCss}>
                              Started
                            </span>
                          </div>
                          {review.frontmatter.progress.map((progress) => {
                            return (
                              <div key={progress.date}>
                                {progress.date}
                                {" – "}
                                {progress.percent === 100 ? (
                                  <span className={progressMilestoneCss}>
                                    Finished
                                  </span>
                                ) : (
                                  `${progress.percent}%`
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </dd>
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

export interface Work {
  title: string;
  year: number;
  kind: string;
  lastReviewGrade: string;
  authors: {
    name: string;
    slug: string;
    notes: string | null;
  }[];
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
  reviews: {
    frontmatter: {
      grade: string;
      edition: string;
      editionNotes: string | null;
      sequence: number;
      progress: {
        date: string;
        percent: number;
      }[];
    };
    readingTime: number;
    linkedHtml: string;
    dateFinished: string;
    dateFinishedIso: string;
  }[];
}

export const pageQuery = graphql`
  query ($slug: String!) {
    work: worksJson(slug: { eq: $slug }) {
      title
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
          editionNotes: edition_notes
          progress {
            date(formatString: "DD MMM, YYYY")
            percent
          }
        }
        readingTime
        dateFinished(formatString: "DD MMM, YYYY")
        dateFinishedIso: dateFinished(formatString: "Y-MM-DD")
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
