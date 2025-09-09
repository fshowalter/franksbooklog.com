/**
 * Type definition for the Author Open Graph image component function
 */
export type AuthorOpenGraphImageComponentType = (
  props: AuthorOpenGraphImageProps,
) => React.JSX.Element;

/**
 * Props for the Author Open Graph image component
 */
type AuthorOpenGraphImageProps = {
  /** Optional author avatar image URL */
  avatar?: string;
  /** Background image URL for the Open Graph image */
  backdrop: string;
  /** Author's display name */
  name: string;
};

/**
 * Open Graph image component for author pages.
 * Renders a 1200x630 image with backdrop, optional author avatar, and author name.
 * Used for social media sharing and SEO meta image tags.
 * 
 * @param props - Component props
 * @param props.avatar - Optional author avatar image URL
 * @param props.backdrop - Background image URL
 * @param props.name - Author's display name
 * @returns Open Graph image JSX for author pages
 */
export function OpenGraphImage({
  avatar,
  backdrop,
  name,
}: AuthorOpenGraphImageProps): React.JSX.Element {
  return (
    <div
      style={{
        backgroundColor: "#f2f0e8",
        display: "flex",
        height: "630px",
        overflow: "hidden",
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
          alignItems: "center",
          backgroundImage:
            "linear-gradient(to top, rgba(0, 0, 0, 0.8) 0px, rgba(0,0,0,.2) 250px, rgba(0, 0, 0, 0) 350px, rgba(0, 0, 0, 0)",
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          left: 0,
          paddingBottom: "64px",
          paddingLeft: "80px",
          paddingRight: "80px",
          paddingTop: "32px",
          position: "absolute",
          width: "1200px",
        }}
      >
        {avatar && (
          <div
            style={{
              borderRadius: "50%",
              boxShadow: "0px 0px 0px 1px #484745",
              display: "flex",
              marginBottom: "32px",
            }}
          >
            <img
              height={250}
              src={avatar}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
              }}
              width={250}
            />
          </div>
        )}
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            paddingLeft: "80px",
            paddingRight: "80px",
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
            Frank&apos;s Book Log
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
              textShadow: "1px 1px 2px rgba(0,0,0,.25)",
              textWrap: "balance",
            }}
          >
            {name}
          </div>
        </div>
      </div>
    </div>
  );
}
