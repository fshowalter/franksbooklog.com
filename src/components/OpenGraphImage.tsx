export type OpenGraphImageComponentType = (
  props: OpenGraphImageProps,
) => React.JSX.Element;

type OpenGraphImageProps = {
  backdrop: string;
  sectionHead?: string;
  title: string;
};

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
            "radial-gradient(400px at left bottom, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.75) 15%, rgba(0, 0, 0, 0)) 25%",
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
            fontSize: "18px",
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
