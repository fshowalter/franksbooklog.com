import type { ReviewWithContent } from "~/api/reviews";

type Props = Pick<ReviewWithContent, "grade" | "title"> & {
  coverImgSrc: string;
};

export function StructuredData({ coverImgSrc, grade, title }: Props) {
  const structuredData = buildStructuredData(title, grade, coverImgSrc);

  if (!structuredData) {
    return false;
  }

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      type="application/ld+json"
    />
  );
}

function buildStructuredData(
  title: Props["title"],
  grade: Props["grade"],
  imageSrc: Props["coverImgSrc"],
) {
  if (grade == "Abandoned") {
    return false;
  }

  const gradeMap: Record<string, number> = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
    F: 1,
  };

  return {
    "@context": "http://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: "Frank Showalter",
    },
    itemReviewed: {
      "@type": "Book",
      image: imageSrc,
      name: title,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: gradeMap[grade[0]],
    },
  };
}
