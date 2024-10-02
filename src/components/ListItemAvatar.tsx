import type { AvatarImageProps } from "src/api/avatars";
import { Avatar } from "src/components/Avatar";
import { ccn } from "src/utils/concatClassNames";

export const ListItemAvatarImageConfig = {
  width: 80,
  height: 80,
};

export function ListItemAvatar({
  name,
  imageProps,
  className,
}: {
  name: string;
  imageProps: AvatarImageProps | null;
  className?: string;
}) {
  const avatar = (
    <Avatar
      name={name}
      imageProps={imageProps}
      width={ListItemAvatarImageConfig.width}
      height={ListItemAvatarImageConfig.height}
      loading="lazy"
      className="w-full"
    />
  );

  return (
    <div
      className={ccn(
        "safari-border-radius-fix w-16 overflow-hidden rounded-full shadow-all tablet:w-20",
        className,
      )}
    >
      {avatar}
    </div>
  );
}
