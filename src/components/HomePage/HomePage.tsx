import { graphql, Link } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import React, { useRef } from "react";
import toSentenceArray from "../../utils/to-sentence-array";
import Grade from "../Grade";
import Layout from "../Layout";
import RenderedMarkdown from "../RenderedMarkdown";
import Seo from "../Seo";
import {
  articleBodyCss,
  articleFooterCss,
  articleHeadingCss,
  containerCss,
  dateCss,
  imageLinkCss,
  kindCss,
  listCss,
  listItemCss,
  paginationCss,
  reviewCreditsCss,
  reviewCss,
  reviewGradeCss,
  reviewHeaderCss,
} from "./HomePage.module.scss";
import Pagination from "./Pagination";

export default function HomePage({
  pageContext,
  data,
}: {
  pageContext: {
    limit: number;
    skip: number;
    numberOfItems: number;
    currentPage: number;
  };
  data: PageQueryResult;
}): JSX.Element {
  const listHeader = useRef<HTMLDivElement>(null);
  const {
    update: { nodes: updates },
  } = data;

  return (
    <Layout>
      <Seo
        pageTitle={
          pageContext.currentPage === 1
            ? "Frank's Book Log: Literature is a relative term."
            : `Page ${pageContext.currentPage}`
        }
        description="Reviews of current, cult, classic, and forgotten books."
        article={false}
        image={null}
      />
      <main className={containerCss} ref={listHeader}>
        <ol className={listCss}>
          {updates.map((update, index) => {
            const review = update;
            const listItemValue =
              pageContext.numberOfItems - pageContext.skip - index;
            const work = update.reviewedWork;

            return (
              <li
                key={review.frontmatter.sequence}
                value={listItemValue}
                className={listItemCss}
              >
                <article className={reviewCss}>
                  <header className={reviewHeaderCss}>
                    <div className={kindCss}>{review.reviewedWork.kind}</div>
                    <h2 className={articleHeadingCss}>
                      <Link
                        to={`/reviews/${review.frontmatter.slug}/`}
                        rel="canonical"
                      >
                        {work.title}
                      </Link>
                    </h2>
                    <p className={reviewCreditsCss}>
                      {toSentenceArray(work.authors.map((a) => a.name))}
                    </p>{" "}
                    <Grade
                      grade={review.frontmatter.grade}
                      className={reviewGradeCss}
                      width={140}
                      height={28}
                    />
                  </header>
                  <Link
                    rel="canonical"
                    className={imageLinkCss}
                    to={`/reviews/${review.frontmatter.slug}/`}
                  >
                    {work.cover && (
                      <GatsbyImage
                        image={work.cover.childImageSharp.gatsbyImageData}
                        alt={`A still from ${work.title} by ${toSentenceArray(
                          work.authors.map((a) => a.name)
                        ).join("")} (${work.year})`}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    )}
                  </Link>
                  <RenderedMarkdown
                    className={articleBodyCss}
                    text={review.linkedExcerpt}
                    tag="main"
                  />
                  <footer className={articleFooterCss}>
                    <div className={dateCss}>{review.dateFinished}</div>
                  </footer>
                </article>
              </li>
            );
          })}
        </ol>
        <Pagination
          className={paginationCss}
          currentPage={pageContext.currentPage}
          urlRoot="/"
          perPage={pageContext.limit}
          numberOfItems={pageContext.numberOfItems}
          prevText="Newer"
          nextText="Older"
        />
      </main>
    </Layout>
  );
}

interface PageQueryResult {
  update: {
    nodes: {
      frontmatter: {
        slug: string;
        grade: string;
        sequence: number;
      };
      linkedExcerpt: string;
      dateFinished: string;
      reviewedWork: {
        title: string;
        year: number;
        kind: string;
        authors: {
          name: string;
          notes: string | null;
        }[];
        cover: {
          childImageSharp: {
            gatsbyImageData: IGatsbyImageData;
          };
        };
      };
    }[];
  };
}

export const pageQuery = graphql`
  query ($skip: Int!, $limit: Int!) {
    update: allMarkdownRemark(
      sort: { fields: [frontmatter___sequence], order: DESC }
      limit: $limit
      skip: $skip
      filter: { postType: { eq: "REVIEW" } }
    ) {
      nodes {
        frontmatter {
          grade
          slug
          sequence
        }
        dateFinished(formatString: "DD MMM, YYYY")
        linkedExcerpt
        reviewedWork {
          title
          year
          kind
          authors {
            name
            notes
          }
          cover {
            childImageSharp {
              gatsbyImageData(
                layout: FIXED
                formats: [JPG, AVIF]
                quality: 80
                width: 160
                placeholder: TRACED_SVG
              )
            }
          }
        }
      }
    }
  }
`;
