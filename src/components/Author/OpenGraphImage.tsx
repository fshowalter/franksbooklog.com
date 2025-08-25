import type { JSX } from "react";

export type AuthorOpenGraphImageComponentType = (
  props: AuthorOpenGraphImageProps,
) => JSX.Element;

type AuthorOpenGraphImageProps = {
  avatar?: string;
  backdrop: string;
  name: string;
};

export function OpenGraphImage({
  avatar,
  backdrop,
  name,
}: AuthorOpenGraphImageProps): JSX.Element {
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
            "linear-gradient(to top, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.5) 10%, rgba(0, 0, 0, 0)) 20%",
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
              color: "#fafafa",
              fontFamily: "Assistant",
              fontWeight: 700,
              marginBottom: "8px",
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
