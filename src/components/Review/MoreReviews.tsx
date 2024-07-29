import type { CoverImageProps } from "src/api/covers";
import type { Review } from "src/api/reviews";
import { CoverGallery } from "src/components/CoverGallery";
import { CoverGalleryHeading } from "src/components/CoverGalleryHeading";
import { CoverGalleryNav } from "src/components/CoverGalleryNav";

type ReviewTitle = Review["moreReviews"][number] & {
  coverImageProps: CoverImageProps;
};

interface Props {
  values: ReviewTitle[];
}

export function MoreReviews({ values }: Props): JSX.Element | null {
  if (values.length < 4) {
    return null;
  }

  return (
    <CoverGalleryNav>
      <CoverGalleryHeading
        leadText="More"
        linkText={"Reviews"}
        linkTarget={"/reviews/"}
      />
      <CoverGallery
        values={values}
        seeAllLinkTarget={"/reviews/"}
        seeAllLinkText={"Reviews"}
      />
    </CoverGalleryNav>
  );
}
