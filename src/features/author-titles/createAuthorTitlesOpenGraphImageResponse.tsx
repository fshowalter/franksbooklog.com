import { getOpenGraphBackdrop } from "~/assets/backdrops";
import { componentToImageResponse } from "~/utils/componentToImageResponse";

/**
 * Props for the Author Open Graph image component
 */
type Props = {
  /** Author's display name */
  name: string;
};

export async function createAuthorTitlesOpenGraphImageResponse({
  name,
}: Props): Promise<Response> {
  const backdrop = await getOpenGraphBackdrop("author");

  return await componentToImageResponse(
    <AuthorTitlesOpenGraphImage name={name} />,
    [
      {
        data: backdrop,
        src: "backdrop",
      },
    ],
  );
}

/**
 * Open Graph image component for author pages.
 * Renders a 1200x630 image with backdrop, optional author avatar, and author name.
 * Used for social media sharing and SEO meta image tags.
 *
 * @param props - Component props
 * @param props.name - Author's display name
 * @returns Open Graph image JSX for author pages
 */
function AuthorTitlesOpenGraphImage({
  name,
}: {
  name: string;
}): React.JSX.Element {
  "use no memo";

  return (
    <div
      style={{
        backgroundColor: "#272727",
        display: "flex",
        height: "630px",
        overflow: "hidden",
        position: "relative",
        width: "1200px",
      }}
    >
      <img
        height={630}
        src="backdrop"
        style={{
          objectFit: "cover",
          opacity: 0.5,
        }}
        width={1200}
      />
      <div
        style={{
          alignItems: "center",
          // backgroundImage:
          // "linear-gradient(to top, rgba(0, 0, 0, 0.8) 0px, rgba(0,0,0,.2) 250px, rgba(0, 0, 0, 0) 350px, rgba(0, 0, 0, 0)",
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          height: "630px",
          justifyContent: "center",
          left: 0,
          paddingBottom: "64px",
          paddingLeft: "80px",
          paddingRight: "80px",
          paddingTop: "32px",
          position: "absolute",
          top: 0,
          width: "1200px",
        }}
      >
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
              fontWeight: 700,
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
              display: "block",
              flexWrap: "wrap",
              fontFamily: "FrankRuhlLibre",
              fontSize: "112px",
              fontWeight: 800,
              lineHeight: 1,
              textAlign: "center",
              textShadow: "1px 1px 2px rgba(0,0,0,.25)",
              textWrap: "balance",
              width: "1100px",
            }}
          >
            {name}
          </div>
        </div>
      </div>
    </div>
  );
}
