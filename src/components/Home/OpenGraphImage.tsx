export type HomeOpenGraphImageComponentType = (
  props: HomeOpenGraphImageProps,
) => React.JSX.Element;

type HomeOpenGraphImageProps = {
  backdrop: string;
};

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
            "radial-gradient(500px at left bottom, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.75) 15%, rgba(0, 0, 0, 0)) 45%",
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          height: 630,
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
