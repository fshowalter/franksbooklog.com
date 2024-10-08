import { toSentenceArray } from "src/utils";

export function OpenGraphImage({
  title,
  authors,
  cover,
  grade,
}: {
  title: string;
  authors: string[];
  cover: string;
  grade: string | undefined;
}): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        height: "630px",
        width: "1200px",
      }}
    >
      <img
        src={cover}
        style={{
          objectFit: "cover",
        }}
        width={420}
        height={630}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: "80px",
          paddingRight: "80px",
          paddingBottom: "32px",
          paddingTop: "32px",
          width: "780px",
          height: "630px",
          backgroundColor: "#252525",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            fontFamily: "ArgentumSans",
            color: "#b0b0b0",
            marginBottom: "24px",
            textTransform: "uppercase",
          }}
        >
          Frank&apos;s Book Log
        </div>
        <div
          style={{
            fontFamily: "FrankRuhlLibre",
            color: "#fff",
            fontSize: "64px",
            lineHeight: 1,
            textWrap: "balance",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "FrankRuhlLibre",
            color: "#fff",
            fontSize: "28px",
            lineHeight: 1,
            textWrap: "balance",
            display: "flex",
            flexWrap: "wrap",
            marginTop: "16px",
          }}
        >
          by {toSentenceArray(authors)}
        </div>
        {grade ? (
          <img
            src={grade}
            height={48}
            width={240}
            style={{ marginTop: "36px" }}
          />
        ) : (
          <div
            style={{
              fontFamily: "ArgentumSans",
              color: "white",
              backgroundColor: "red",
              textTransform: "uppercase",
              marginTop: "36px",
              padding: "4px",
            }}
          >
            Abandoned
          </div>
        )}
      </div>
    </div>
  );
}
