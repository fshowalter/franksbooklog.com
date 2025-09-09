import { CoverListItem } from "~/components/cover-list/CoverListItem";
import { ListItemDetails } from "~/components/list-item-details/ListItemDetails";
import { ListItemGrade } from "~/components/list-item-grade/ListItemGrade";
import { ListItemKindAndYear } from "~/components/list-item-kind-and-year/ListItemKindAndYear";
import { ListItemReviewDate } from "~/components/list-item-review-date/ListItemReviewDate";
import { ListItemTitle } from "~/components/list-item-title/ListItemTitle";
import { toSentenceArray } from "~/utils/toSentenceArray";

import type { AuthorValue } from "./Author";

export function AuthorWorkListItem({
  value,
}: {
  value: AuthorValue;
}): React.JSX.Element {
  return (
    <CoverListItem coverImageProps={value.coverImageProps}>
      <ListItemDetails>
        <ListItemTitle slug={value.slug} title={value.title} />
        <OtherAuthors values={value.otherAuthors} />
        <ListItemKindAndYear kind={value.kind} year={value.workYear} />
        <ListItemGrade grade={value.grade} />
        <ListItemReviewDate displayDate={value.displayDate} />
      </ListItemDetails>
    </CoverListItem>
  );
}

function OtherAuthors({
  values,
}: {
  values: AuthorValue["otherAuthors"];
}): false | React.JSX.Element {
  if (values.length === 0) {
    return false;
  }

  return (
    <div className="font-serif text-[15px] leading-5">
      (with {toSentenceArray(values.map((value) => value.name))})
    </div>
  );
}
