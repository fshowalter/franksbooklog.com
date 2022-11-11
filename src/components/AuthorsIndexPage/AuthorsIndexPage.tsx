import { graphql, Link } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { useReducer } from "react";
import DebouncedInput from "../DebouncedInput";
import Fieldset from "../Fieldset";
import FilterPageHeader from "../FilterPageHeader";
import HeadBuilder from "../HeadBuilder";
import Layout from "../Layout";
import { SelectField } from "../SelectField";
import {
  containerCss,
  defaultImageCss,
  filtersCss,
  leftCss,
  listCss,
  listItemAvatarCss,
  listItemCss,
  listItemLinkCss,
  listItemTitleCss,
  pageHeaderCss,
  percentBackgroundCss,
  percentProgressCss,
  progressRingCss,
  progressStatsCss,
  rightCss,
} from "./AuthorsIndexPage.module.scss";
import {
  ActionType,
  initState,
  reducer,
  SortValue,
} from "./AuthorsIndexPage.reducer";

function Progress({ author }: { author: Author }): JSX.Element {
  const percent = author.reviewedWorkCount / author.workCount;
  const circumference = 17.5 * 2 * Math.PI;

  return (
    <svg
      viewBox="0 0 36 36"
      className={progressRingCss}
      preserveAspectRatio="none"
    >
      <g id="circles" strokeWidth="1">
        <circle
          r="17.5"
          cx="18"
          cy="18"
          fill="none"
          className={percentBackgroundCss}
        />
        <circle
          r="17.5"
          cx="18"
          cy="18"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - percent * circumference}
          className={percentProgressCss}
        />
      </g>
    </svg>
  );
}

function ListItem({ author }: { author: Author }): JSX.Element {
  if (author.avatar) {
    return (
      <li className={listItemCss}>
        <Link className={listItemLinkCss} to={`/shelf/authors/${author.slug}/`}>
          {author.avatar && (
            <GatsbyImage
              image={author.avatar.childImageSharp.gatsbyImageData}
              className={listItemAvatarCss}
              alt={`An image of ${author.name}`}
            />
          )}
          <Progress author={author} />
        </Link>
        <div className={listItemTitleCss}>
          <Link to={`/shelf/authors/${author.slug}/`}>{author.name}</Link>
        </div>
        <div className={progressStatsCss}>
          {author.reviewedWorkCount} / {author.workCount}
        </div>
      </li>
    );
  }
  return (
    <li className={listItemCss}>
      <div className={listItemLinkCss}>
        <Link className={listItemLinkCss} to={`/shelf/authors/${author.slug}/`}>
          <svg
            className={`${listItemAvatarCss} ${defaultImageCss}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              clipRule="evenodd"
              d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zM8 9a5 5 0 00-4.546 2.916A5.986 5.986 0 008 14a5.986 5.986 0 004.546-2.084A5 5 0 008 9z"
              fillRule="evenodd"
            />
          </svg>
          <Progress author={author} />
        </Link>
      </div>
      <div className={listItemTitleCss}>
        <Link to={`/shelf/authors/${author.slug}/`}>{author.name}</Link>
      </div>
      <div className={progressStatsCss}>
        {author.reviewedWorkCount} / {author.workCount}
      </div>
    </li>
  );
}

export function Head(): JSX.Element {
  return (
    <HeadBuilder
      pageTitle={`Authors`}
      description={`A sortable and filterable list of shelf authors.`}
      image={null}
      article={false}
    />
  );
}

/**
 * Renders an index page for authors.
 */
export default function AuthorIndexPage({
  data,
}: {
  data: PageQueryResult;
}): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      authors: [...data.author.nodes],
    },
    initState
  );

  return (
    <Layout>
      <main className={containerCss}>
        <div className={leftCss}>
          <FilterPageHeader
            className={pageHeaderCss}
            heading={`Authors`}
            tagline={
              <q>
                There is nothing to writing. All you do is sit down at a
                typewriter and bleed.
              </q>
            }
            breadcrumb={<Link to="/shelf/">Shelf</Link>}
          />
          <div className={filtersCss}>
            <Fieldset legend="Filter & Sort">
              <DebouncedInput
                label="Name"
                placeholder="Enter all or part of a name"
                onChange={(value) =>
                  dispatch({ type: ActionType.FILTER_NAME, value })
                }
              />
              <SelectField
                value={state.sortValue}
                label="Order By"
                onChange={(e) =>
                  dispatch({
                    type: ActionType.SORT,
                    value: e.target.value as SortValue,
                  })
                }
              >
                <option value="name">Name</option>
                <option value="works">Work Count</option>
                <option value="reviews">Review Count</option>
              </SelectField>
            </Fieldset>
          </div>
        </div>
        <div className={rightCss}>
          <ul data-testid="author-list" className={listCss}>
            {state.filteredAuthors.map((author) => {
              return <ListItem key={author.slug} author={author} />;
            })}
          </ul>
        </div>
      </main>
    </Layout>
  );
}

export interface Author {
  name: string;
  slug: string;
  workCount: number;
  reviewedWorkCount: number;
  sortName: string;
  avatar: null | {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData;
    };
  };
}

interface PageQueryResult {
  author: {
    nodes: Author[];
  };
}

export const pageQuery = graphql`
  {
    author: allAuthorsJson(
      filter: { reviewed: { eq: true } }
      sort: { sort_name: ASC }
    ) {
      nodes {
        name
        sortName: sort_name
        slug
        workCount
        reviewedWorkCount
        avatar {
          childImageSharp {
            gatsbyImageData(
              layout: CONSTRAINED
              formats: [JPG, AVIF]
              quality: 80
              width: 160
              height: 160
              placeholder: TRACED_SVG
            )
          }
        }
      }
    }
  }
`;
