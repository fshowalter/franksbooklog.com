import type { CoverImageProps } from "~/api/covers";

import { CoverListItem } from "~/components/cover-list/CoverListItem";
import { ListItemAuthors } from "~/components/list-item-authors/ListItemAuthors";
import { ListItemDetails } from "~/components/list-item-details/ListItemDetails";
import { ListItemGrade } from "~/components/list-item-grade/ListItemGrade";
import { ListItemKindAndYear } from "~/components/list-item-kind-and-year/ListItemKindAndYear";
import { ListItemReviewDate } from "~/components/list-item-review-date/ListItemReviewDate";
import { ListItemTitle } from "~/components/list-item-title/ListItemTitle";

type ReviewsListItemValue = {
  authors: {
    name: string;
  }[];
  coverImageProps: CoverImageProps;
  displayDate: string;
  grade: string;
  kind: string;
  slug: string;
  title: string;
  workYear: string;
};

/**
 * Individual list item component for displaying a book review in the reviews list.
 * Renders a cover image alongside review metadata including title, authors,
 * kind, year, grade, and review date in a consistent layout.
 * 
 * @param props - Component props
 * @param props.value - Review data for display
 * @returns Review list item component with cover and metadata
 */
export function ReviewsListItem({
  value,
}: {
  value: ReviewsListItemValue;
}): React.JSX.Element {
  return (
    <CoverListItem coverImageProps={value.coverImageProps}>
      <ListItemDetails>
        <ListItemTitle slug={value.slug} title={value.title} />
        <ListItemAuthors values={value.authors} />
        <ListItemKindAndYear kind={value.kind} year={value.workYear} />
        <ListItemGrade grade={value.grade} />
        <ListItemReviewDate displayDate={value.displayDate} />
      </ListItemDetails>
    </CoverListItem>
  );
}
