import type { AvatarImageProps } from "~/api/avatars";

import { Avatar } from "~/components/Avatar";
import { ccn } from "~/utils/concatClassNames";

export const ListItemAvatarImageConfig = {
  height: 80,
  width: 80,
};

export function ListItemAvatar({
  className,
  fill,
  imageProps,
}: {
  className?: string;
  fill?: string;
  imageProps: AvatarImageProps | undefined;
}) {
  const avatar = (
    <Avatar
      className="w-full"
      fill={fill}
      height={ListItemAvatarImageConfig.height}
      imageProps={imageProps}
      loading="lazy"
      width={ListItemAvatarImageConfig.width}
    />
  );

  return (
    <div
      className={ccn(
        `
          w-16 safari-border-radius-fix overflow-hidden rounded-full
          shadow-(--bg-avatar-default)
          tablet:w-20
        `,
        className,
      )}
      style={{
        boxShadow: fill ? `0 0 0 1px ${fill}` : undefined,
      }}
    >
      {avatar}
    </div>
  );
}
