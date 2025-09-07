import { CoverListItem } from "~/components/CoverList/CoverListItem";
import { ListItemDetails } from "~/components/ListItemDetails/ListItemDetails";
import { ListItemGrade } from "~/components/ListItemGrade/ListItemGrade";
import { ListItemKindAndYear } from "~/components/ListItemKindAndYear/ListItemKindAndYear";
import { ListItemReviewDate } from "~/components/ListItemReviewDate/ListItemReviewDate";
import { ListItemTitle } from "~/components/ListItemTitle/ListItemTitle";
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
