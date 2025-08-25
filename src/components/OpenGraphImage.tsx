import type { JSX } from "react";
export function OpenGraphImage({
  backdrop,
  sectionHead = "Frank's Book Log",
  title,
}: {
  backdrop: string;
  sectionHead?: string;
  title: string;
}): JSX.Element {
  return (
    <div
      style={{
        backgroundColor: "#f2f0e8",
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
            "linear-gradient(to top, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.5) 10%, rgba(0, 0, 0, 0)) 20%",
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          paddingBottom: "64px",
          paddingLeft: "80px",
          paddingRight: "80px",
          paddingTop: "32px",
          position: "absolute",
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
            textShadow: "1px 1px 2px rgba(0,0,0,.25)",
            textWrap: "balance",
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}
