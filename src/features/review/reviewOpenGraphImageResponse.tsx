import path from "node:path";
import sharp from "sharp";

import {
  getCoverHeight,
  getCoverWidth,
  getOpenGraphCover,
  getWorkCoverPath,
} from "~/assets/covers";
import { gradeMap } from "~/components/utils/gradeMap";
import { componentToImageResponse } from "~/utils/componentToImageResponse";
import { formatWorkAuthors } from "~/utils/formatWorkAuthors";

type Props = {
  authors: {
    name: string;
    notes: string | undefined;
  }[];
  coverSlug: string;
  grade: string;
  title: string;
};

export async function reviewOpenGraphImageResponse({
  authors,
  coverSlug,
  grade,
  title,
}: Props): Promise<Response> {
  const cover = await getOpenGraphCover(coverSlug);

  let gradeBuffer;

  const gradeFile = fileForGrade(grade);

  if (gradeFile) {
    gradeBuffer = await sharp(path.resolve(`./public${gradeFile}`))
      .resize(240)
      .toBuffer();
  }

  let coverHeight = 630;
  let coverWidth = await getCoverWidth({ slug: coverSlug }, coverHeight);

  if (coverWidth > 500) {
    const workCoverPath = getWorkCoverPath({ slug: coverSlug });
    coverHeight = await getCoverHeight(workCoverPath, 500);
    coverWidth = 500;
  }

  const fetchedResources = [
    {
      data: cover,
      src: "cover",
    },
  ];

  if (gradeBuffer) {
    fetchedResources.push({
      data: new Uint8Array(gradeBuffer).buffer,
      src: "grade",
    });
  }

  return await componentToImageResponse(
    <ReviewOpenGraphImage
      authors={authors}
      coverHeight={coverHeight}
      coverWidth={coverWidth}
      grade={Boolean(gradeFile)}
      title={title}
    />,
    fetchedResources,
  );
}

function fileForGrade(value: string): string | undefined {
  if (!value || value == "Abandoned") {
    return;
  }

  const [src] = gradeMap[value];

  return src;
}

function ReviewOpenGraphImage({
  authors,
  coverHeight,
  coverWidth,
  grade,
  title,
}: {
  authors: {
    name: string;
    notes: string | undefined;
  }[];
  coverHeight: number;
  coverWidth: number;
  grade: boolean;
  title: string;
}): React.JSX.Element {
  "use no memo";

  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: "#272727",
        display: "flex",
        height: "630px",
        position: "relative",
        width: "1200px",
      }}
    >
      <img
        height={coverHeight}
        src="cover"
        style={{
          objectFit: "cover",
        }}
        width={coverWidth}
      />
      <div
        style={{
          alignItems: "flex-start",
          backgroundColor: "#272727",
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
            color: "#c29d52",
            fontFamily: "Assistant",
            fontSize: "18px",
            fontWeight: 700,
            marginBottom: "12px",
            textShadow: "1px 1px 2px black",
            textTransform: "uppercase",
          }}
        >
          Frank&apos;s Book Log
        </div>
        <div
          style={{
            color: "#fff",
            display: "block",
            flexWrap: "wrap",
            fontFamily: "FrankRuhlLibre",
            fontSize: "54px",
            fontWeight: 600,
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
            fontWeight: 400,
            lineHeight: 1,
            marginTop: "16px",
            textWrap: "balance",
          }}
        >
          by {formatWorkAuthors(authors)}
        </div>
        {grade ? (
          <img
            height={48}
            src="grade"
            style={{ marginTop: "36px" }}
            width={240}
          />
        ) : (
          <div
            style={{
              backgroundColor: "#c02b30",
              color: "white",
              fontFamily: "Assistant",
              fontWeight: 600,
              marginTop: "36px",
              padding: "8px",
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
