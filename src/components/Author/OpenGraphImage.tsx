export function OpenGraphImage({
  avatar,
  name,
}: {
  avatar: string;
  name: string;
}): JSX.Element {
  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: "#f2f0e8",
        display: "flex",
        flexDirection: "column",
        height: "630px",
        justifyContent: "center",
        position: "relative",
        width: "1200px",
      }}
    >
      <img
        height={250}
        src={avatar}
        style={{
          borderRadius: "50%",
          marginBottom: "32px",
          objectFit: "cover",
        }}
        width={250}
      />
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
            color: "rgb(0 0 0 / 60%)",
            fontFamily: "ArgentumSans",
            marginBottom: "16px",
            textTransform: "uppercase",
          }}
        >
          Frank&apos;s Book Log
        </div>
        <div
          style={{
            color: "rgb(0 0 0 / 75%)",
            display: "flex",
            flexWrap: "wrap",
            fontFamily: "ArgentumSans",
            fontSize: "88px",
            fontWeight: 600,
            lineHeight: 1,
            textAlign: "center",
            textTransform: "uppercase",
            textWrap: "balance",
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
}
