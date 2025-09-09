import type { AvatarImageProps } from "~/api/avatars";

import { Avatar } from "~/components/avatar/Avatar";
import { GroupingListItem } from "~/components/grouping-list-item/GroupingListItem";

/**
 * Configuration for avatar images in list items
 */
export const AvatarListItemImageConfig = {
  height: 80,
  width: 80,
};

/**
 * List item component for displaying content with an avatar image.
 * Features hover effects and responsive design with avatar scaling.
 * 
 * @param props - Component props
 * @param props.avatarImageProps - Image properties for the avatar
 * @param props.children - Content to display alongside the avatar
 * @param props.className - Additional CSS classes
 * @returns List item with avatar and content
 */
export function AvatarListItem({
  avatarImageProps,
  children,
  className = "",
}: {
  avatarImageProps: AvatarImageProps | undefined;
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <li
      className={`
        group/list-item relative mb-1 flex max-w-(--breakpoint-desktop) flex-row
        gap-x-4 bg-default px-container py-4 transition-all
        tablet:gap-x-6 tablet:px-4
        tablet-landscape:has-[a:hover]:z-5
        tablet-landscape:has-[a:hover]:scale-[102.5%]
        tablet-landscape:has-[a:hover]:transform-gpu
        tablet-landscape:has-[a:hover]:shadow-all
        tablet-landscape:has-[a:hover]:drop-shadow-2xl
        tablet-landscape:has-[a:hover]:duration-500
        laptop:px-6
        ${className}
      `}
    >
      <div
        className={`
          relative rounded-full
          after:absolute after:top-0 after:left-0 after:size-full
          after:bg-default after:opacity-20 after:transition-opacity
          after:duration-500
          group-has-[a:hover]/list-item:after:opacity-0
          ${className}
        `}
      >
        <ListItemAvatar imageProps={avatarImageProps} />
      </div>
      {children}
    </li>
  );
}

/**
 * Grouped avatar list component for displaying items organized by categories.
 * Renders groups with headers and contains avatar list items within each group.
 * 
 * @param props - Component props
 * @param props.children - Render function for individual list items
 * @param props.className - Additional CSS classes for the list
 * @param props.groupedValues - Map of group names to collections of items
 * @param props.groupItemClassName - CSS classes for group items
 * @param props.rest - Additional props passed to the list element
 * @returns Grouped list with avatar items
 */
export function GroupedAvatarList<T>({
  children,
  className,
  groupedValues,
  groupItemClassName,
  ...rest
}: {
  children: (item: T) => React.ReactNode;
  className?: string;
  groupedValues: Map<string, Iterable<T>>;
  groupItemClassName?: string;
}): React.JSX.Element {
  return (
    <>
      <ol
        className={`
          ${className ?? ""}
        `}
        data-testid="grouped-avatar-list"
        {...rest}
      >
        {[...groupedValues].map((groupedValue) => {
          const [group, groupValues] = groupedValue;
          return (
            <GroupingListItem
              className={groupItemClassName}
              groupText={group}
              key={group}
            >
              <ol>{[...groupValues].map((value) => children(value))}</ol>
            </GroupingListItem>
          );
        })}
      </ol>
    </>
  );
}

/**
 * Internal component for rendering avatar images within list items.
 * Handles the avatar display with proper sizing, rounded styling,
 * and hover effects for use within avatar list items.
 * 
 * @param props - The component props
 * @param props.imageProps - Image properties for the avatar, or undefined for placeholder
 * @returns A JSX element containing the styled avatar
 */
function ListItemAvatar({
  imageProps,
}: {
  imageProps: AvatarImageProps | undefined;
}): React.JSX.Element {
  const avatar = (
    <Avatar
      className={`
        w-full transform-gpu transition-transform duration-500
        group-has-[a:hover]/list-item:scale-110
      `}
      height={AvatarListItemImageConfig.height}
      imageProps={imageProps}
      loading="lazy"
      width={AvatarListItemImageConfig.width}
    />
  );

  return (
    <div
      className={`
        w-16 safari-border-radius-fix overflow-hidden rounded-full
        ${imageProps ? `drop-shadow-md` : ``}
        tablet:w-20
      `}
    >
      {avatar}
    </div>
  );
}
