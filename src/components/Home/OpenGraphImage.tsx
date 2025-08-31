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
            fontFamily: "FrankRuhlLibre",
            fontSize: "72px",
            fontWeight: 800,
          }}
        >
          Franks Book Log
        </div>
      </div>
    </div>
  );
}
