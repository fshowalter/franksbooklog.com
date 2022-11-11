import { graphql, Link } from "gatsby";
import { IGatsbyImageData } from "gatsby-plugin-image";
import { useReducer } from "react";
import Button from "../Button";
import { Cover, CoverList } from "../CoverList";
import DebouncedInput from "../DebouncedInput";
import Fieldset from "../Fieldset";
import FilterPageHeader from "../FilterPageHeader";
import HeadBuilder from "../HeadBuilder";
import Layout from "../Layout";
import ProgressGraph from "../ProgressGraph";
import { SelectField, SelectOptions } from "../SelectField";
import YearInput from "../YearInput";
import {
  avatarCss,
  containerCss,
  filtersCss,
  leftCss,
  listHeaderGroupCss,
  listInfoCss,
  pageHeaderCss,
  percentCss,
  percentTotalsCss,
  rightCss,
  showMoreCss,
} from "./AuthorPage.module.scss";
import reducer, { ActionType, initState, SortType } from "./AuthorPage.reducer";

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

function groupForWork(work: Work, sortType: SortType): string {
  switch (sortType) {
    case "year-published-asc":
    case "year-published-desc": {
      return work.year.toString();
    }
    case "grade-asc":
    case "grade-desc": {
      return work.lastReviewGrade || "Unrated";
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
  sortType,
}: {
  works: Work[];
  sortType: SortType;
}): Map<string, Work[]> {
  const groupedWorks: Map<string, Work[]> = new Map();

  works.map((work) => {
    const group = groupForWork(work, sortType);
    let groupValue = groupedWorks.get(group);

    if (!groupValue) {
      groupValue = [];
      groupedWorks.set(group, groupValue);
    }
    groupValue.push(work);
  });

  return groupedWorks;
}

function AuthorProgress({
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
        {reviewed}/{total} Reviewed
      </div>
    </>
  );
}

export function Head({ data }: { data: PageQueryResult }): JSX.Element {
  const author = data.author.nodes[0];

  return (
    <HeadBuilder
      pageTitle={author.name}
      description={`A sortable and filterable list of reviews of works by ${author.name}.`}
      image={null}
      article={false}
    />
  );
}

/**
 * Renders a page for a work author.
 */
export default function AuthorPage({
  data,
}: {
  data: PageQueryResult;
}): JSX.Element {
  const author = data.author.nodes[0];

  const [state, dispatch] = useReducer(
    reducer,
    {
      works: [...author.works],
    },
    initState
  );

  const groupedWorks = groupWorks({
    works: state.filteredWorks.slice(0, state.showCount),
    sortType: state.sortType,
  });

  let pageHeaderProps = {};

  if (author.avatar) {
    pageHeaderProps = {
      avatar: author.avatar.childImageSharp.gatsbyImageData,
    };
  } else {
    pageHeaderProps = {
      avatarElement: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          className={avatarCss}
        >
          <path
            clipRule="evenodd"
            d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zM8 9a5 5 0 00-4.546 2.916A5.986 5.986 0 008 14a5.986 5.986 0 004.546-2.084A5 5 0 008 9z"
            fillRule="evenodd"
          />
        </svg>
      ),
    };
  }

  return (
    <Layout>
      <main className={containerCss}>
        <div className={leftCss}>
          <FilterPageHeader
            {...pageHeaderProps}
            className={pageHeaderCss}
            alt={`An image of ${author.name}`}
            heading={author.name}
            tagline={`Author of ${state.allWorks.length.toLocaleString()} shelved works.`}
            breadcrumb={
              <div>
                <Link to="/shelf/">Shelf</Link> /{" "}
                <Link to="/shelf/authors/">Authors</Link>
              </div>
            }
          />
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
                label="Kind"
                onChange={(e) =>
                  dispatch({
                    type: ActionType.FILTER_KIND,
                    value: e.target.value,
                  })
                }
              >
                <SelectOptions options={data.author.kinds} />
              </SelectField>
              <YearInput
                label="Year Published"
                years={data.author.publishedYears}
                onChange={(values) =>
                  dispatch({ type: ActionType.FILTER_PUBLISHED_YEAR, values })
                }
              />
              <SelectField
                value={state.sortType}
                label="Order By"
                onChange={(e) =>
                  dispatch({
                    type: ActionType.SORT,
                    value: e.target.value as SortType,
                  })
                }
              >
                <option value="year-published-asc">
                  Year Published (Oldest First)
                </option>
                <option value="year-published-desc">
                  Year Published (Newest First)
                </option>
                <option value="title">Title</option>
                <option value="grade-desc">Grade (Best First)</option>
                <option value="grade-asc">Grade (Worst First)</option>
              </SelectField>
            </Fieldset>
            <div className={listInfoCss}>
              <ListInfo
                visible={state.showCount}
                total={state.filteredWorks.length}
              />
            </div>
            <div className={percentCss}>
              <AuthorProgress
                total={state.filteredWorks.length}
                reviewed={state.reviewedWorkCount}
              />
            </div>
          </div>
        </div>
        <div className={rightCss}>
          <ol data-testid="work-list">
            {[...groupedWorks].map(([group, works], index) => {
              return (
                <li key={group}>
                  <div
                    className={listHeaderGroupCss}
                    style={{ zIndex: index + 100 }}
                  >
                    {group}
                  </div>
                  <CoverList>
                    {works.map((work) => {
                      return (
                        <Cover
                          key={work.slug}
                          title={work.title}
                          year={work.year}
                          slug={work.reviewed ? work.slug : null}
                          grade={work.lastReviewGrade}
                          kind={work.kind}
                          image={work.cover}
                        />
                      );
                    })}
                  </CoverList>
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

type WorkBase = {
  title: string;
  year: number;
  sortTitle: string;
  slug: string;
  reviewed: boolean;
  kind: string;
  cover: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData;
    };
  };
};

type UnreviewedWork = {
  lastReviewGrade: null;
  lastReviewGradeValue: null;
} & WorkBase;

type ReviewedWork = {
  lastReviewGrade: string;
  lastReviewGradeValue: number;
} & WorkBase;

export type Work = UnreviewedWork | ReviewedWork;

interface PageQueryResult {
  author: {
    nodes: {
      name: string;
      avatar: null | {
        childImageSharp: {
          gatsbyImageData: IGatsbyImageData;
        };
      };
      works: Work[];
    }[];
    publishedYears: string[];
    kinds: string[];
  };
}

export const pageQuery = graphql`
  query ($slug: String!) {
    author: allAuthorsJson(filter: { slug: { eq: $slug } }) {
      nodes {
        name
        sortName: sort_name
        avatar {
          childImageSharp {
            gatsbyImageData(
              layout: FIXED
              formats: [JPG, AVIF]
              quality: 80
              width: 200
              height: 200
              placeholder: TRACED_SVG
            )
          }
        }
        works {
          title
          year
          kind
          reviewed
          lastReviewGrade
          lastReviewGradeValue
          slug
          sortTitle: sort_title
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
      publishedYears: distinct(field: { works: { year: SELECT } })
      kinds: distinct(field: { works: { kind: SELECT } })
    }
  }
`;
