import { CoverListItem } from "~/components/react/cover-list/CoverListItem";
import { ListItemDetails } from "~/components/react/list-item-details/ListItemDetails";
import { ListItemGrade } from "~/components/react/list-item-grade/ListItemGrade";
import { ListItemKindAndYear } from "~/components/react/list-item-kind-and-year/ListItemKindAndYear";
import { ListItemReviewDate } from "~/components/react/list-item-review-date/ListItemReviewDate";
import { ListItemTitle } from "~/components/react/list-item-title/ListItemTitle";
import { formatWorkAuthors } from "~/utils/formatWorkAuthors";

import type { AuthorTitlesValue } from "./AuthorTitles";
import type { AuthorTitlesSort } from "./sortAuthorTitles";

/**
 * List item component for displaying an author's work in the author page cover grid.
 * Shows cover image, title, co-authors, work details, grade, and review date.
 *
 * @param props - Component props
 * @param props.value - Author work data containing all display information
 * @returns Cover list item with work details
 */
export function AuthorWorksListItem({
  sortValue,
  value,
}: {
  sortValue: AuthorTitlesSort;
  value: AuthorTitlesValue;
}): React.JSX.Element {
  if (sortValue.startsWith("grade-")) {
    return <GradeSortListItem value={value} />;
  }

  if (sortValue.startsWith("review-date-")) {
    return <ReviewDateListItem value={value} />;
  }

  return <TitleSortListItem value={value} />;
}

function GradeSortListItem({
  value,
}: {
  value: AuthorTitlesValue;
}): React.JSX.Element {
  return (
    <CoverListItem coverImageProps={value.coverImageProps}>
      <ListItemDetails>
        <ListItemGrade grade={value.grade} />
        <ListItemTitle slug={value.slug} title={value.title} />
        <OtherAuthors values={value.otherAuthors} />
        <ListItemKindAndYear kind={value.kind} year={value.titleYear} />
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
      (with {formatWorkAuthors(values)})
    </div>
  );
}

function ReviewDateListItem({
  value,
}: {
  value: AuthorTitlesValue;
}): React.JSX.Element {
  return (
    <CoverListItem coverImageProps={value.coverImageProps}>
      <ListItemDetails>
        <ListItemReviewDate displayDate={value.displayDate} />
        <ListItemTitle slug={value.slug} title={value.title} />
        <OtherAuthors values={value.otherAuthors} />
        <ListItemKindAndYear kind={value.kind} year={value.titleYear} />
        <ListItemGrade grade={value.grade} />
      </ListItemDetails>
    </CoverListItem>
  );
}

function TitleSortListItem({
  value,
}: {
  value: AuthorTitlesValue;
}): React.JSX.Element {
  return (
    <CoverListItem coverImageProps={value.coverImageProps}>
      <ListItemDetails>
        <ListItemTitle slug={value.slug} title={value.title} />
        <OtherAuthors values={value.otherAuthors} />
        <ListItemKindAndYear kind={value.kind} year={value.titleYear} />
        <ListItemGrade grade={value.grade} />
        <ListItemReviewDate displayDate={value.displayDate} />
      </ListItemDetails>
    </CoverListItem>
  );
}
