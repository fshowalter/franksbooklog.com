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
            color: "#fff",
            display: "flex",
            fontFamily: "FrankRuhlLibre",
            fontSize: "72px",
            fontWeight: 800,
            lineHeight: 1,
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
          Test
        </div>
      </div>
    </div>
  );
}
