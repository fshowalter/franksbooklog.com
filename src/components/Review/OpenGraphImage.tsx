import type { JSX } from "react";

import { toSentenceArray } from "~/utils";

export function OpenGraphImage({
  authors,
  cover,
  grade,
  title,
}: {
  authors: string[];
  cover: string;
  grade: string | undefined;
  title: string;
}): JSX.Element {
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
        src={cover}
        style={{
          objectFit: "cover",
        }}
        width={420}
      />
      <div
        style={{
          alignItems: "flex-start",
          backgroundColor: "#252525",
          display: "flex",
          flexDirection: "column",
          height: "630px",
          justifyContent: "center",
          paddingBottom: "32px",
          paddingLeft: "80px",
          paddingRight: "80px",
          paddingTop: "32px",
          width: "780px",
        }}
      >
        <div
          style={{
            color: "#b0b0b0",
            fontFamily: "ArgentumSans",
            marginBottom: "24px",
            textTransform: "uppercase",
          }}
        >
          Frank&apos;s Book Log
        </div>
        <div
          style={{
            color: "#fff",
            display: "flex",
            flexWrap: "wrap",
            fontFamily: "FrankRuhlLibre",
            fontSize: "64px",
            lineHeight: 1,
            textWrap: "balance",
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: "#fff",
            display: "flex",
            flexWrap: "wrap",
            fontFamily: "FrankRuhlLibre",
            fontSize: "28px",
            lineHeight: 1,
            marginTop: "16px",
            textWrap: "balance",
          }}
        >
          by {toSentenceArray(authors)}
        </div>
        {grade ? (
          <img
            height={48}
            src={grade}
            style={{ marginTop: "36px" }}
            width={240}
          />
        ) : (
          <div
            style={{
              backgroundColor: "red",
              color: "white",
              fontFamily: "ArgentumSans",
              marginTop: "36px",
              padding: "4px",
              textTransform: "uppercase",
            }}
          >
            Abandoned
          </div>
        )}
      </div>
    </div>
  );
}
