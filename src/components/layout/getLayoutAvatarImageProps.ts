import { getAvatarImageProps } from "~/api/avatars";

import { AvatarImageConfig } from "./Backdrop";

/**
 * Fetches backdrop image properties for the layout component.
 * @param slug - The slug identifier for the backdrop image
 * @returns Backdrop image properties configured for layout use
 */
export async function getLayoutAvatarImageProps(slug: string) {
  return getAvatarImageProps(slug, AvatarImageConfig);
}
