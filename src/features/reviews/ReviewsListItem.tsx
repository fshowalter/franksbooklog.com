import type { CoverImageProps } from "~/api/covers";

import { CoverListItem } from "~/components/CoverList/CoverListItem";
import { ListItemAuthors } from "~/components/ListItemAuthors/ListItemAuthors";
import { ListItemDetails } from "~/components/ListItemDetails/ListItemDetails";
import { ListItemGrade } from "~/components/ListItemGrade/ListItemGrade";
import { ListItemKindAndYear } from "~/components/ListItemKindAndYear/ListItemKindAndYear";
import { ListItemReviewDate } from "~/components/ListItemReviewDate/ListItemReviewDate";
import { ListItemTitle } from "~/components/ListItemTitle/ListItemTitle";

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
