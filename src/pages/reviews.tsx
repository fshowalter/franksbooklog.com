import { graphql } from "gatsby";
import { HeadBuilder, Reviews } from "../components";

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

export default function ReviewsPage({
  data,
}: {
  data: Queries.ReviewsPageQuery;
}): JSX.Element {
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
    books: allReviewsJson(filter: { kind: { ne: "Short Story" } }) {
      totalCount
    }
    shortStory: allReviewsJson(filter: { kind: { eq: "Short Story" } }) {
      totalCount
    }
    abandoned: allReviewsJson(filter: { gradeValue: { eq: 0 } }) {
      totalCount
    }
    reviewedWork: allReviewsJson(sort: { authors: { sortName: ASC } }) {
      nodes {
        ...ReviewsListItem
      }
      publishedYears: distinct(field: { yearPublished: SELECT })
      reviewYears: distinct(field: { yearReviewed: SELECT })
      kinds: distinct(field: { kind: SELECT })
    }
  }
`;
