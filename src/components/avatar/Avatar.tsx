import type { AvatarImageProps } from "~/api/avatars";

/**
 * Props for the Avatar component, extending standard HTML img attributes.
 */
type AvatarProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** Optional CSS classes to apply to the avatar */
  className?: string;
  /** Fill color for the default avatar icon SVG */
  fill?: string;
  /** Height of the avatar in pixels */
  height: number;
  /** Image properties if an avatar image is available */
  imageProps: AvatarImageProps | undefined;
  /** Loading strategy for the image */
  loading: "eager" | "lazy";
  /** Width of the avatar in pixels */
  width: number;
};

/**
 * Avatar component that displays either an author image or a default user icon.
 * When no image is provided, shows a styled SVG placeholder icon.
 *
 * @param props - Component props extending HTML img attributes
 * @param props.className - Optional CSS classes to apply
 * @param props.fill - Fill color for the default avatar icon
 * @param props.imageProps - Image properties if avatar image is available
 * @param props.rest - Additional HTML img attributes
 * @returns Avatar component with image or default icon
 */
export function Avatar({
  className,
  fill,
  imageProps,
  ...rest
}: AvatarProps): React.JSX.Element {
  if (imageProps) {
    return <img {...imageProps} alt="" {...rest} className={className} />;
  }

  return (
    <div className={className}>
      <svg
        fill={fill || "var(--background-color-subtle)"}
        viewBox="0 0 16 16"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clipRule="evenodd"
          d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zM8 9a5 5 0 00-4.546 2.916A5.986 5.986 0 008 14a5.986 5.986 0 004.546-2.084A5 5 0 008 9z"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}
