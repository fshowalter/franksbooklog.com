import { graphql } from "gatsby";
import { Reviews } from "../components";
import { HeadBuilder } from "../components/HeadBuilder";

export function Head(): JSX.Element {
  return (
    <HeadBuilder
      pageTitle="Reviews"
      description="A sortable and filterable list of every book or short story I've read and reviewed since 2022."
      image={null}
      article={false}
    />
  );
}

/**
 * Renders the reviews page.
 */
export default function ReviewsPage({
  data,
}: {
  data: Queries.ReviewsPageQuery;
}): JSX.Element {
  console.log(data);
  return (
    <Reviews
      items={data.reviewedWork.nodes}
      shortStoryCount={data.shortStory.totalCount}
      bookCount={data.books.totalCount}
      abandonedCount={data.abandoned.totalCount}
      distinctKinds={data.reviewedWork.kinds}
      distinctPublishedYears={data.reviewedWork.publishedYears}
      distinctReviewYears={data.reviewedWork.reviewYears}
      initialSort="author-asc"
    />
  );
}

export const pageQuery = graphql`
  query ReviewsPage {
    books: allReviewedWorksJson(filter: { kind: { ne: "Short Story" } }) {
      totalCount
    }
    shortStory: allReviewedWorksJson(filter: { kind: { eq: "Short Story" } }) {
      totalCount
    }
    abandoned: allReviewedWorksJson(filter: { gradeValue: { eq: 0 } }) {
      totalCount
    }
    reviewedWork: allReviewedWorksJson(sort: { authors: { sortName: ASC } }) {
      nodes {
        ...ReviewsListItem
      }
      publishedYears: distinct(field: { yearPublished: SELECT })
      reviewYears: distinct(field: { reviewYear: SELECT })
      kinds: distinct(field: { kind: SELECT })
    }
  }
`;
