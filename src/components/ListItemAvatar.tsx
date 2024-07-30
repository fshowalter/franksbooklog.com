import type { AvatarImageProps } from "src/api/avatars";
import { Avatar } from "src/components/Avatar";

export const ListItemAvatarImageConfig = {
  width: 64,
  height: 64,
};

export function ListItemAvatar({
  name,
  slug,
  imageProps,
}: {
  name: string;
  slug: string | null;
  imageProps: AvatarImageProps | null;
}) {
  const avatar = (
    <Avatar
      name={name}
      imageProps={imageProps}
      width={ListItemAvatarImageConfig.width}
      height={ListItemAvatarImageConfig.height}
      loading="lazy"
      decoding="async"
    />
  );

  if (!slug) {
    return (
      <div className="safari-border-radius-fix w-16 max-w-16 overflow-hidden rounded-[50%] shadow-all">
        {avatar}
      </div>
    );
  }

  return (
    <a
      href={`/authors/${slug}/`}
      className="safari-border-radius-fix w-16 max-w-16 overflow-hidden rounded-[50%] shadow-all"
    >
      {avatar}
    </a>
  );
}
