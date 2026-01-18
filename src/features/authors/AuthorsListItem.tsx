import { AvatarListItem } from "~/components/avatar-list/AvatarList";

import type { AuthorsValue } from "./Authors";

/**
 * List item component for displaying an author in the authors page avatar grid.
 * Shows author avatar, name as a link, and review count with proper singular/plural handling.
 *
 * @param props - Component props
 * @param props.value - Author data containing display information
 * @returns Author list item with avatar and details
 */
export function AuthorsListItem({
  value,
}: {
  value: AuthorsValue;
}): React.JSX.Element {
  return (
    <AvatarListItem avatarImageProps={value.avatarImageProps}>
      <div className="flex flex-col justify-center">
        <AuthorName name={value.name} slug={value.slug} />
        <div
          className={`
            mt-[6px] font-sans text-[13px] font-normal tracking-prose
            text-nowrap text-subtle
          `}
        >
          {value.reviewCount} {value.reviewCount > 1 ? "Reviews" : "Review"}
        </div>
      </div>
    </AvatarListItem>
  );
}

/**
 * Internal component for rendering the author's name as a clickable link.
 * Links to the author's individual page and includes hover effects.
 *
 * @param props - Component props
 * @param props.name - Author's display name
 * @param props.slug - Author's URL slug for linking
 * @returns Clickable author name link
 */
function AuthorName({
  name,
  slug,
}: {
  name: AuthorsValue["name"];
  slug: string;
}): React.JSX.Element {
  return (
    <a
      className={`
        text-base/normal font-semibold text-default transition-all duration-500
        after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
        after:opacity-0
        hover:text-accent
      `}
      href={`/authors/${slug}/`}
    >
      <div className="leading-normal">{name}</div>
    </a>
  );
}
