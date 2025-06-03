import type { JSX } from "react";
export function OpenGraphImage({
  backdrop,
  sectionHead = "Frank's Book Log",
  title,
}: {
  backdrop?: string;
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
      {backdrop && (
        <img
          height={630}
          src={backdrop}
          style={{
            objectFit: "cover",
          }}
          width={1200}
        />
      )}
      <div
        style={{
          backgroundImage: backdrop
            ? "linear-gradient(to top, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0))"
            : "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))",
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
            color: backdrop ? "#b0b0b0" : "rgb(0 0 0 / 60%)",
            fontFamily: "ArgentumSans",
            marginBottom: "16px",
            textShadow: backdrop ? "1px 1px 2px black" : "none",
            textTransform: "uppercase",
          }}
        >
          {sectionHead}
        </div>
        <div
          style={{
            color: backdrop ? "#fff" : "rgb(0 0 0 / 75%)",
            display: "flex",
            flexWrap: "wrap",
            fontFamily: "ArgentumSans",
            fontSize: "88px",
            fontWeight: 600,
            lineHeight: 1,
            textTransform: "uppercase",
            textWrap: "balance",
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}
