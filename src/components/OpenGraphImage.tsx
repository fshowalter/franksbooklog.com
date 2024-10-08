export function OpenGraphImage({
  title,
  sectionHead = "Frank's Book Log",
}: {
  sectionHead?: string;
  title: string;
}): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        height: "630px",
        width: "1200px",
        backgroundColor: "#f2f0e8",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingLeft: "80px",
          paddingRight: "80px",
          paddingBottom: "64px",
          paddingTop: "32px",
          width: "1200px",
          position: "absolute",
          bottom: 0,
        }}
      >
        <div
          style={{
            fontFamily: "ArgentumSans",
            color: "rgb(0 0 0 / 60%)",
            marginBottom: "16px",
            textTransform: "uppercase",
          }}
        >
          {sectionHead}
        </div>
        <div
          style={{
            fontFamily: "ArgentumSans",
            color: "rgb(0 0 0 / 75%)",
            fontSize: "88px",
            lineHeight: 1,
            textWrap: "balance",
            display: "flex",
            flexWrap: "wrap",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}
