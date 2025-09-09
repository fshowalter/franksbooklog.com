/**
 * Type definition for the Home Open Graph image component function
 */
export type HomeOpenGraphImageComponentType = (
  props: HomeOpenGraphImageProps,
) => React.JSX.Element;

/**
 * Props for the Home Open Graph image component
 */
type HomeOpenGraphImageProps = {
  /** Background image URL for the Open Graph image */
  backdrop: string;
};

/**
 * Open Graph image component for the home page.
 * Renders a 1200x630 image with backdrop, site title, and tagline.
 * Used for social media sharing and SEO meta image tags.
 *
 * @param props - Component props
 * @param props.backdrop - Background image URL
 * @returns Open Graph image JSX for the home page
 */
export function OpenGraphImage({
  backdrop,
}: HomeOpenGraphImageProps): React.JSX.Element {
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
          top: 0,
          width: "1200px",
        }}
      >
        <div
          style={{
            color: "#fff",
            display: "flex",
            fontFamily: "FrankRuhlLibre",
            fontSize: "72px",
            fontWeight: 800,
            lineHeight: 1,
            marginTop: "auto",
            textShadow: "1px 1px 2px black",
          }}
        >
          Frank&apos;s Book Log
        </div>
        <div
          style={{
            color: "#c29d52",
            fontFamily: "Assistant",
            fontSize: "20px",
            fontWeight: 700,
            marginBottom: "8px",
            textShadow: "1px 1px 2px black",
          }}
        >
          Literature is a relative term.
        </div>
      </div>
    </div>
  );
}
