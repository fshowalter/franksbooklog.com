import { graphql } from "gatsby";
import { HeadBuilder, Review } from "../components";
import { toSentenceArray } from "../utils/";

export function Head({
  data,
}: {
  data: Queries.ReviewTemplateQuery;
}): JSX.Element {
  const { reviewedWork } = data;
  const authorNames = toSentenceArray(
    reviewedWork.authors.map((author) => author.name)
  ).join(", ");

  return (
    <HeadBuilder
      pageTitle={`${reviewedWork.title} by ${authorNames}`}
      description={`A review of the ${reviewedWork.yearPublished} ${reviewedWork.kind} by ${authorNames}.`}
      image={reviewedWork.seoImage.childImageSharp?.resize?.src}
      article
    />
  );
}

export default function ReviewTemplate({
  data,
}: {
  data: Queries.ReviewTemplateQuery;
}): JSX.Element {
  return <Review reviewData={data.reviewedWork} />;
}

export const pageQuery = graphql`
  query ReviewTemplate($id: String!) {
    reviewedWork: reviewedWork(id: $id) {
      ...ReviewData
    }
  }
`;
