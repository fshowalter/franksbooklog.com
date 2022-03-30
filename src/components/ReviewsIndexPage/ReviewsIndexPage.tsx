import { graphql } from "gatsby";
import { IGatsbyImageData } from "gatsby-plugin-image";
import React, { useReducer, useRef } from "react";
import Button from "../Button";
import { Cover, CoverList } from "../CoverList";
import DebouncedInput from "../DebouncedInput/DebouncedInput";
import Fieldset from "../Fieldset";
import FilterPageHeader from "../FilterPageHeader";
import GradeInput from "../GradeInput";
import Layout from "../Layout";
import { SelectField, SelectOptions } from "../SelectField";
import Seo from "../Seo";
import YearInput from "../YearInput";
import {
  calloutCss,
  containerCss,
  filtersCss,
  leftCss,
  listHeaderGroupCss,
  listInfoCss,
  pageHeaderCss,
  rightCss,
  showMoreCss,
} from "./ReviewsIndexPage.module.scss";
import type { SortType } from "./ReviewsIndexPage.reducer";
import reducer, { ActionTypes, initState } from "./ReviewsIndexPage.reducer";

function ListInfo({
  visible,
  total,
}: {
  visible: number;
  total: number;
}): JSX.Element {
  let showingText;

  if (visible > total) {
    showingText = `Showing ${total} of ${total}`;
  } else {
    showingText = `Showing 1-${visible} of ${total.toLocaleString()}`;
  }

  return <div className={listInfoCss}>{showingText}</div>;
}

function groupForReview(review: Review, sortValue: SortType): string {
  switch (sortValue) {
    case "published-date-asc":
    case "published-date-desc": {
      return review.reviewedWork.year.toString();
    }
    case "read-date-asc":
    case "read-date-desc": {
      return review.monthFinished;
    }
    case "grade-asc":
    case "grade-desc": {
      return review.frontmatter.grade;
    }
    case "title": {
      const letter = review.reviewedWork.sortTitle.substring(0, 1);

      if (letter.toLowerCase() == letter.toUpperCase()) {
        return "#";
      }

      return review.reviewedWork.sortTitle.substring(0, 1).toLocaleUpperCase();
    }
    // no default
  }
}

function groupReviews({
  reviews,
  sortValue,
}: {
  reviews: Review[];
  sortValue: SortType;
}): Map<string, Review[]> {
  const groupedReviews: Map<string, Review[]> = new Map();

  reviews.map((review) => {
    const group = groupForReview(review, sortValue);
    let groupValue = groupedReviews.get(group);

    if (!groupValue) {
      groupValue = [];
      groupedReviews.set(group, groupValue);
    }
    groupValue.push(review);
  });

  return groupedReviews;
}

/**
 * Renders the reviews page.
 */
export default function ReviewsIndexPage({
  data,
}: {
  data: PageQueryResult;
}): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      reviews: [...data.review.nodes],
    },
    initState
  );

  const listHeader = useRef<HTMLDivElement>(null);

  const groupedReviews = groupReviews({
    reviews: state.filteredReviews.slice(0, state.showCount),
    sortValue: state.sortValue,
  });

  return (
    <Layout>
      <Seo
        pageTitle="Reviews"
        description="A sortable and filterable list of every book I've reviewed since 2022."
        image={null}
        article={false}
      />
      <main className={containerCss}>
        <div className={leftCss}>
          <FilterPageHeader
            className={pageHeaderCss}
            heading="Reviews"
            tagline={
              <p>
                I&apos;ve published{" "}
                <span className={calloutCss}>
                  {data.review.totalCount.toLocaleString()}
                </span>{" "}
                reviews since 2022.
              </p>
            }
          />
          <div className={filtersCss}>
            <Fieldset legend="Filter & Sort">
              <DebouncedInput
                label="Title"
                placeholder="Enter all or part of a title"
                onChange={(value) =>
                  dispatch({ type: ActionTypes.FILTER_TITLE, value })
                }
              />
              <YearInput
                label="Published Year"
                years={data.review.publishedYears}
                onChange={(values) =>
                  dispatch({ type: ActionTypes.FILTER_PUBLISHED_YEAR, values })
                }
              />
              <YearInput
                label="Read Year"
                years={data.review.readYears}
                onChange={(values) =>
                  dispatch({ type: ActionTypes.FILTER_READ_YEAR, values })
                }
              />
              <GradeInput
                label="Grade"
                onChange={(values) =>
                  dispatch({
                    type: ActionTypes.FILTER_GRADE,
                    values,
                  })
                }
              />
              <SelectField
                label="Kind"
                onChange={(e) =>
                  dispatch({
                    type: ActionTypes.FILTER_KIND,
                    value: e.target.value,
                  })
                }
              >
                <SelectOptions options={data.review.kinds} />
              </SelectField>
              <SelectField
                label="Edition"
                onChange={(e) =>
                  dispatch({
                    type: ActionTypes.FILTER_EDITION,
                    value: e.target.value,
                  })
                }
              >
                <SelectOptions options={data.review.editions} />
              </SelectField>
              <SelectField
                value={state.sortValue}
                label="Order By"
                onChange={(e) =>
                  dispatch({
                    type: ActionTypes.SORT,
                    value: e.target.value as SortType,
                  })
                }
              >
                <option value="read-date-desc">Read Date (Newest First)</option>
                <option value="read-date-asc">Read Date (Oldest First)</option>
                <option value="published-date-desc">
                  Year Published (Newest First)
                </option>
                <option value="published-date-asc">
                  Year Published (Oldest First)
                </option>
                <option value="title">Title</option>
                <option value="grade-desc">Grade (Best First)</option>
                <option value="grade-asc">Grade (Worst First)</option>
              </SelectField>
            </Fieldset>
            <div className={listInfoCss}>
              <ListInfo
                visible={state.showCount}
                total={state.filteredReviews.length}
              />
            </div>
          </div>
        </div>
        <div className={rightCss} ref={listHeader}>
          <ol data-testid="review-list">
            {[...groupedReviews].map(([group, reviews], index) => {
              return (
                <li key={group}>
                  <div
                    className={listHeaderGroupCss}
                    style={{ zIndex: index + 100 }}
                  >
                    {group}
                  </div>
                  <CoverList>
                    {reviews.map((review) => {
                      return (
                        <Cover
                          key={review.frontmatter.sequence}
                          title={review.reviewedWork.title}
                          year={review.reviewedWork.year}
                          grade={review.frontmatter.grade}
                          date={review.dateFinishedFormatted}
                          edition={review.frontmatter.edition}
                          kind={review.reviewedWork.kind}
                          slug={review.frontmatter.slug}
                          image={review.reviewedWork.cover}
                        />
                      );
                    })}
                  </CoverList>
                </li>
              );
            })}
          </ol>
          <div className={showMoreCss}>
            {state.filteredReviews.length > state.showCount && (
              <Button onClick={() => dispatch({ type: ActionTypes.SHOW_MORE })}>
                <svg
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                </svg>
                Show More
              </Button>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}

export interface Review {
  frontmatter: {
    sequence: number;
    grade: string;
    slug: string;
    edition: string;
  };
  dateFinished: string;
  dateFinishedFormatted: string;
  monthFinished: string;
  yearFinished: number;
  gradeValue: number;
  reviewedWork: {
    title: string;
    year: number;
    sortTitle: string;
    kind: string;
    cover: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData;
      };
    };
  };
}

interface PageQueryResult {
  review: {
    totalCount: number;
    nodes: Review[];
    editions: string[];
    publishedYears: string[];
    readYears: string[];
    kinds: string[];
  };
}

export const pageQuery = graphql`
  query {
    review: allMarkdownRemark(
      filter: { postType: { eq: "REVIEW" } }
      sort: { fields: frontmatter___sequence, order: DESC }
    ) {
      totalCount
      editions: distinct(field: frontmatter___edition)
      publishedYears: distinct(field: reviewedWork___year)
      readYears: distinct(field: yearFinished)
      kinds: distinct(field: reviewedWork___kind)
      nodes {
        frontmatter {
          sequence
          grade
          slug
          edition
        }
        yearFinished
        monthFinished: dateFinished(formatString: "MMM YYYY")
        dateFinished
        dateFinishedFormatted: dateFinished(formatString: "MMM D, YYYY")
        gradeValue
        reviewedWork {
          title
          year
          sortTitle: sort_title
          kind
          authors {
            name
            notes
          }
          cover {
            childImageSharp {
              gatsbyImageData(
                layout: CONSTRAINED
                formats: [JPG, AVIF]
                quality: 80
                width: 200
                placeholder: TRACED_SVG
              )
            }
          }
        }
      }
    }
  }
`;
