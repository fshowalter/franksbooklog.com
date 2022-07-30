import { graphql, Link } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { useRef } from "react";
import toSentenceArray from "../../utils/to-sentence-array";
import Grade from "../Grade";
import HeadBuilder from "../HeadBuilder";
import Layout from "../Layout";
import RenderedMarkdown from "../RenderedMarkdown";
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

export function Head({
  pageContext,
}: {
  pageContext: PageContext;
}): JSX.Element {
  return (
    <HeadBuilder
      pageTitle={
        pageContext.currentPage === 1
          ? "Frank's Book Log: Literature is a relative term."
          : `Page ${pageContext.currentPage}`
      }
      description="Reviews of current, cult, classic, and forgotten books."
      article={false}
      image={null}
    />
  );
}

interface PageContext {
  limit: number;
  skip: number;
  numberOfItems: number;
  currentPage: number;
}

export default function HomePage({
  pageContext,
  data,
}: {
  pageContext: PageContext;
  data: PageQueryResult;
}): JSX.Element {
  const listHeader = useRef<HTMLDivElement>(null);
  const {
    update: { nodes: updates },
  } = data;

  return (
    <Layout>
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
                      by{" "}
                      {toSentenceArray(
                        work.authors.map((author) => (
                          <AuthorLink key={author.slug} author={author} />
                        ))
                      )}
                    </p>{" "}
                    {review.frontmatter.grade && (
                      <Grade
                        grade={review.frontmatter.grade}
                        className={reviewGradeCss}
                        width={140}
                        height={28}
                      />
                    )}
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

interface Author {
  name: string;
  slug: string;
  notes: string | null;
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
        authors: Author[];
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
            slug
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
