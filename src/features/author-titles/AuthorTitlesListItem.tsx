import { CoverListItem } from "~/components/cover-list/CoverListItem";
import { ListItemDetails } from "~/components/list-item-details/ListItemDetails";
import { ListItemGrade } from "~/components/list-item-grade/ListItemGrade";
import { ListItemKindAndYear } from "~/components/list-item-kind-and-year/ListItemKindAndYear";
import { ListItemReviewDate } from "~/components/list-item-review-date/ListItemReviewDate";
import { ListItemTitle } from "~/components/list-item-title/ListItemTitle";
import { toSentenceArray } from "~/utils/toSentenceArray";

import type { AuthorTitlesValue } from "./AuthorTitles";

/**
 * List item component for displaying an author's work in the author page cover grid.
 * Shows cover image, title, co-authors, work details, grade, and review date.
 *
 * @param props - Component props
 * @param props.value - Author work data containing all display information
 * @returns Cover list item with work details
 */
export function AuthorWorksListItem({
  value,
}: {
  value: AuthorTitlesValue;
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

/**
 * Internal component to display other authors (co-authors) for a work.
 * Shows a formatted list of other authors if any exist, otherwise renders nothing.
 *
 * @param props - Component props
 * @param props.values - Array of other author objects
 * @returns Co-author list or false if no co-authors
 */
function OtherAuthors({
  values,
}: {
  values: AuthorTitlesValue["otherAuthors"];
}): false | React.JSX.Element {
  if (values.length === 0) {
    return false;
  }

  return (
    <div className="font-serif text-[15px]/5">
      (with {toSentenceArray(values.map((value) => value.name))})
    </div>
  );
}
