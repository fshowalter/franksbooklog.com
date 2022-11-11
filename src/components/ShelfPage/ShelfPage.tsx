import { graphql, Link } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { useReducer, useRef } from "react";
import toSentenceArray from "../../utils/to-sentence-array";
import Button from "../Button";
import DebouncedInput from "../DebouncedInput/DebouncedInput";
import Fieldset from "../Fieldset";
import FilterPageHeader from "../FilterPageHeader";
import HeadBuilder from "../HeadBuilder";
import Layout from "../Layout";
import ProgressGraph from "../ProgressGraph";
import { SelectField, SelectOptions } from "../SelectField";
import YearInput from "../YearInput";
import {
  authorsIconCss,
  authorsLinkCss,
  containerCss,
  filtersCss,
  leftCss,
  listCss,
  listHeaderGroupCss,
  listInfoCss,
  listItemCheckmarkCss,
  listItemCoverCss,
  listItemCss,
  listItemSlugCss,
  listItemTitleCss,
  listItemTitleLinkCss,
  listItemTitleYearCss,
  pageHeaderCss,
  percentCss,
  percentTotalsCss,
  quoteCss,
  rightCss,
  showMoreCss,
} from "./ShelfPage.module.scss";
import type { SortType } from "./ShelfPage.reducer";
import reducer, { ActionType, initState } from "./ShelfPage.reducer";

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

function groupForWork(work: Work, sortValue: SortType): string {
  switch (sortValue) {
    case "author-asc":
    case "author-desc": {
      const letter = work.authors[0].sortName.substring(0, 1);

      if (letter.toLowerCase() == letter.toUpperCase()) {
        return "#";
      }

      return work.authors[0].sortName.substring(0, 1).toLocaleUpperCase();
    }
    case "published-date-asc":
    case "published-date-desc": {
      return work.year.toString();
    }
    case "title": {
      const letter = work.sortTitle.substring(0, 1);

      if (letter.toLowerCase() == letter.toUpperCase()) {
        return "#";
      }

      return work.sortTitle.substring(0, 1).toLocaleUpperCase();
    }
    // no default
  }
}

function groupWorks({
  works,
  sortValue,
}: {
  works: Work[];
  sortValue: SortType;
}): Map<string, Work[]> {
  const groupedWorks: Map<string, Work[]> = new Map();

  works.map((work) => {
    const group = groupForWork(work, sortValue);
    let groupValue = groupedWorks.get(group);

    if (!groupValue) {
      groupValue = [];
      groupedWorks.set(group, groupValue);
    }
    groupValue.push(work);
  });

  return groupedWorks;
}

/**
 * Renders a work title.
 */
function WorkTitle({
  work,
}: {
  /** The movie to render */
  work: Work;
}): JSX.Element {
  let title = (
    <>
      {work.title} <span className={listItemTitleYearCss}>{work.year}</span>
    </>
  );

  if (work.reviewed) {
    title = (
      <Link
        rel="canonical"
        to={`/reviews/${work.slug}/`}
        className={listItemTitleLinkCss}
      >
        {title}
      </Link>
    );
  }

  return <div className={listItemTitleCss}>{title}</div>;
}

function WorkCheckMark({ work }: { work: Work }): JSX.Element {
  if (work.reviewed) {
    return (
      <svg
        className={listItemCheckmarkCss}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={0.5}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
  }

  return <div className={listItemCheckmarkCss} />;
}

/**
 * Renders a work title slug.
 */
function WorkSlug({ work }: { work: Work }): JSX.Element {
  const authorNames = work.authors.map((author) => author.name);

  return (
    <div className={listItemSlugCss}>
      {work.kind} by {toSentenceArray(authorNames)}.
    </div>
  );
}

function ShelfProgress({
  total,
  reviewed,
}: {
  total: number;
  reviewed: number;
}): JSX.Element {
  return (
    <>
      <ProgressGraph total={total} complete={reviewed} />
      <div className={percentTotalsCss}>
        {reviewed}/{total.toLocaleString()} Reviewed
      </div>
    </>
  );
}

function reviewedWorkCount(filteredWorks: Work[]): number {
  const reviewedWorks = filteredWorks.filter((m) => m.reviewed);

  return reviewedWorks.length;
}

function WorkCover({ work }: { work: Work }): JSX.Element {
  const cover = (
    <GatsbyImage
      className={listItemCoverCss}
      image={work.cover.childImageSharp.gatsbyImageData}
      alt={`A cover from ${work.title} (${work.year})`}
    />
  );

  if (work.reviewed) {
    return (
      <Link
        rel="canonical"
        to={`/reviews/${work.slug}/`}
        className={listItemCoverCss}
      >
        {cover}
      </Link>
    );
  }

  return <div className={listItemCoverCss}>{cover}</div>;
}

export function Head(): JSX.Element {
  return (
    <HeadBuilder
      pageTitle="The Shelf"
      description="My movie review bucketlist."
      image={null}
      article={false}
    />
  );
}

/**
 * Renders the watchlist page.
 */
export default function ShelfIndexPage({
  data,
}: {
  data: PageQueryResult;
}): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      works: [...data.work.nodes],
    },
    initState
  );

  const listHeader = useRef<HTMLDivElement>(null);
  const reviewedCount = reviewedWorkCount(state.filteredWorks);
  const groupedWorks = groupWorks({
    works: state.filteredWorks.slice(0, state.showCount),
    sortValue: state.sortValue,
  });

  return (
    <Layout>
      <main className={containerCss}>
        <div className={leftCss}>
          <FilterPageHeader
            className={pageHeaderCss}
            heading="The Shelf"
            tagline={
              <>
                <q className={quoteCss}>
                  A man&apos;s got to know his limitations.
                </q>
                <p>
                  My reading bucketlist.{" "}
                  {state.allWorks.length.toLocaleString()} titles.{" "}
                </p>
              </>
            }
          />
          <Link to="/shelf/authors/" className={authorsLinkCss}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={authorsIconCss}
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Authors
          </Link>
          <div className={filtersCss}>
            <Fieldset legend="Filter & Sort">
              <DebouncedInput
                label="Title"
                placeholder="Enter all or part of a title"
                onChange={(value) =>
                  dispatch({ type: ActionType.FILTER_TITLE, value })
                }
              />
              <SelectField
                label="Author"
                onChange={(e) =>
                  dispatch({
                    type: ActionType.FILTER_AUTHOR,
                    value: e.target.value,
                  })
                }
              >
                <SelectOptions options={data.work.authors} />
              </SelectField>
              <SelectField
                label="Kind"
                onChange={(e) =>
                  dispatch({
                    type: ActionType.FILTER_KIND,
                    value: e.target.value,
                  })
                }
              >
                <SelectOptions options={data.work.kinds} />
              </SelectField>
              <YearInput
                label="Year Published"
                years={data.work.publishedYears}
                onChange={(values) =>
                  dispatch({ type: ActionType.FILTER_PUBLISHED_YEAR, values })
                }
              />
              <SelectField
                label="Order By"
                onChange={(e) =>
                  dispatch({
                    type: ActionType.SORT,
                    value: e.target.value as SortType,
                  })
                }
              >
                <option value="author">Author</option>
                <option value="published-date-asc">
                  Year Published (Oldest First)
                </option>
                <option value="published-date-desc">
                  Year Published (Newest First)
                </option>
                <option value="title">Title</option>
              </SelectField>
            </Fieldset>
            <div className={listInfoCss}>
              <ListInfo
                visible={state.showCount}
                total={state.filteredWorks.length}
              />
            </div>
            <div className={percentCss}>
              <ShelfProgress
                total={state.filteredWorks.length}
                reviewed={reviewedCount}
              />
              {(reviewedCount > 0 || state.hideReviewed) && (
                <Button
                  onClick={() => dispatch({ type: ActionType.TOGGLE_REVIEWED })}
                >
                  {state.hideReviewed ? "Show Reviewed" : "Hide Reviewed"}
                </Button>
              )}
            </div>
          </div>
        </div>
        <div ref={listHeader} className={rightCss}>
          <ol data-testid="work-list" className={listCss}>
            {[...groupedWorks].map(([group, works], index) => {
              return (
                <li key={group}>
                  <div
                    className={listHeaderGroupCss}
                    style={{ zIndex: index + 100 }}
                  >
                    {group}
                  </div>
                  <ol>
                    {works.map((work) => {
                      return (
                        <li key={work.slug} className={listItemCss}>
                          <WorkCover work={work} />
                          <WorkTitle work={work} />
                          <WorkSlug work={work} />
                          <WorkCheckMark work={work} />
                        </li>
                      );
                    })}
                  </ol>
                </li>
              );
            })}
          </ol>
          <div className={showMoreCss}>
            {state.filteredWorks.length > state.showCount && (
              <Button onClick={() => dispatch({ type: ActionType.SHOW_MORE })}>
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

export interface Work {
  title: string;
  year: number;
  sortTitle: string;
  reviewed: boolean;
  slug: string;
  kind: string;
  authors: {
    name: string;
    slug: string;
    sortName: string;
    reviewed: boolean;
    notes: string | null;
  }[];
  cover: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData;
    };
  };
}

interface PageQueryResult {
  work: {
    nodes: Work[];
    publishedYears: string[];
    authors: string[];
    kinds: string[];
  };
}

export const pageQuery = graphql`
  {
    work: allWorksJson(sort: [{ authors: { sort_name: ASC } }, { year: ASC }]) {
      nodes {
        title
        year
        sortTitle: sort_title
        reviewed
        slug
        kind
        authors {
          name
          sortName: sort_name
          slug
          notes
          reviewed
        }
        cover {
          childImageSharp {
            gatsbyImageData(
              layout: FIXED
              formats: [JPG, AVIF]
              quality: 80
              width: 48
              placeholder: TRACED_SVG
            )
          }
        }
      }
      publishedYears: distinct(field: { year: SELECT })
      authors: distinct(field: { authors: { name: SELECT } })
      kinds: distinct(field: { kind: SELECT })
    }
  }
`;
