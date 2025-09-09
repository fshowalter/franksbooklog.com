/**
 * Type definition for Open Graph image components.
 * Used for dynamically generating social media preview images.
 */
export type OpenGraphImageComponentType = (
  props: OpenGraphImageProps,
) => React.JSX.Element;

/**
 * Props for the Open Graph image component.
 * Defines the data needed to generate social media preview images.
 */
type OpenGraphImageProps = {
  /** URL of the backdrop image to use as background */
  backdrop: string;
  /** Optional section heading text (defaults to "Frank's Book Log") */
  sectionHead?: string;
  /** Main title text to display prominently */
  title: string;
};

/**
 * Renders an Open Graph image for social media sharing.
 * Creates a 1200x630 image with backdrop, gradient overlay, and styled text
 * optimized for social media platforms like Twitter and Facebook.
 *
 * @param props - The component props
 * @param props.backdrop - URL of the backdrop image
 * @param props.sectionHead - Section heading text (defaults to "Frank's Book Log")
 * @param props.title - Main title to display
 * @returns A JSX element containing the Open Graph image layout
 */
export function OpenGraphImage({
  backdrop,
  sectionHead = "Frank's Book Log",
  title,
}: OpenGraphImageProps): React.JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        height: "630px",
        position: "relative",
        width: "1200px",
      }}
    >
      <img
        height={630}
        src={backdrop}
        style={{
          objectFit: "cover",
        }}
        width={1200}
      />
      <div
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(0, 0, 0, 0.8) 0px, rgba(0,0,0,.2) 200px, rgba(0, 0, 0, 0) 300px, rgba(0, 0, 0, 0)",
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          paddingBottom: "64px",
          paddingLeft: "80px",
          paddingRight: "80px",
          paddingTop: "332px",
          position: "absolute",
          width: "1200px",
        }}
      >
        <div
          style={{
            color: "#c29d52",
            fontFamily: "Assistant",
            fontSize: "20px",
            fontWeight: 800,
            marginBottom: "8px",
            textShadow: "1px 1px 2px black",
            textTransform: "uppercase",
          }}
        >
          {sectionHead}
        </div>
        <div
          style={{
            color: "#fff",
            display: "flex",
            flexWrap: "wrap",
            fontFamily: "FrankRuhlLibre",
            fontSize: "88px",
            fontWeight: 800,
            lineHeight: 1,
            textShadow: "1px 1px 2px black",
            textWrap: "balance",
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}
