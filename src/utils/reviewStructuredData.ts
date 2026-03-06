import { getStructuredDataCoverSrc } from "~/api/covers";

const structuredDataGradeMap: Record<string, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  F: 1,
};

export async function reviewStructuredData(
  slug: string,
  title: string,
  grade: string,
) {
  return {
    "@context": "http://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: "Frank Showalter",
    },
    itemReviewed: {
      "@type": "Book",
      image: await getStructuredDataCoverSrc({ slug }),
      name: title,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: structuredDataGradeMap[grade[0]],
    },
  };
}
