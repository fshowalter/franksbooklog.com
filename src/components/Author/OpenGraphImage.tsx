export function OpenGraphImage({
  name,
  avatar,
}: {
  name: string;
  avatar: string;
}): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "630px",
        width: "1200px",
        backgroundColor: "#f2f0e8",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={avatar}
        style={{
          objectFit: "cover",
          marginBottom: "32px",
          borderRadius: "50%",
        }}
        width={250}
        height={250}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingLeft: "80px",
          paddingRight: "80px",
          width: "1200px",
        }}
      >
        <div
          style={{
            fontFamily: "ArgentumSans",
            marginBottom: "16px",
            textTransform: "uppercase",
            color: "rgb(0 0 0 / 60%)",
          }}
        >
          Frank&apos;s Book Log
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
            textAlign: "center",
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
}
