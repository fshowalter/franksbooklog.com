import type { JSX } from "react";

import { toSentenceArray } from "~/utils";

export function OpenGraphImage({
  authors,
  coverBase64DataUri,
  coverHeight,
  coverWidth,
  grade,
  title,
}: {
  authors: string[];
  coverBase64DataUri: string;
  coverHeight: number;
  coverWidth: number;
  grade: string | undefined;
  title: string;
}): JSX.Element {
  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: "#252525",
        display: "flex",
        height: "630px",
        position: "relative",
        width: "1200px",
      }}
    >
      <img
        height={coverHeight}
        src={coverBase64DataUri}
        style={{
          objectFit: "cover",
        }}
        width={coverWidth}
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
          width: `${1200 - coverWidth}px`,
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
