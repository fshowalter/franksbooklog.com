import { cacheDir } from "astro:config/server";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

import type { GradeText } from "~/utils/grades";

import { componentToImageBytes } from "~/utils/componentToImage";
import { formatTitleAuthors } from "~/utils/formatTitleAuthors";
import { GRADE_SVG_MAP } from "~/utils/grades";

const assetsCacheDir = new URL("reviewOpenGraphImages/", cacheDir);
await fs.mkdir(assetsCacheDir, { recursive: true });

const sourceComponentHash = createHash("md5")
  .update(
    await fs.readFile(
      `./src/features/review/createReviewOpenGraphImageResponse.tsx`,
      "utf8",
    ),
  )
  .digest("hex");

const gradeCache: Record<
  Exclude<GradeText, "Abandoned">,
  undefined | { buffer: Buffer; hash: string }
> = {
  A: undefined,
  "A+": undefined,
  "A-": undefined,
  B: undefined,
  "B+": undefined,
  "B-": undefined,
  C: undefined,
  "C+": undefined,
  "C-": undefined,
  D: undefined,
  "D+": undefined,
  "D-": undefined,
  F: undefined,
  "F+": undefined,
  "F-": undefined,
};

export async function createReviewOpenGraphImageResponse({
  authors,
  coverSlug,
  grade,
  title,
}: {
  authors: {
    name: string;
    notes: string | undefined;
  }[];
  coverSlug: string;
  grade: GradeText;
  title: string;
}): Promise<Response> {
  const image = await getReviewOpenGraphImage({
    authors,
    coverSlug,
    grade,
    title,
  });

  return new Response(image as ArrayBufferView<ArrayBuffer>, {
    headers: {
      "Content-Type": "image/jpeg",
    },
  });
}

async function getCoverHeight(
  coverBuffer: Buffer,
  targetWidth: number,
): Promise<number> {
  const { height, width } = await sharp(coverBuffer).metadata();

  return (height / width) * targetWidth;
}

async function getCoverWidth(
  coverBuffer: Buffer,
  targetHeight: number,
): Promise<number> {
  const { height, width } = await sharp(coverBuffer).metadata();

  return (width / height) * targetHeight;
}

async function getGradeBuffer(
  grade: GradeText,
): Promise<undefined | { buffer: Buffer; hash: string }> {
  if (grade === "Abandoned") {
    return undefined;
  }

  const gradeCacheEntry = gradeCache[grade];
  let gradeHash;
  let gradeBuffer;

  if (gradeCacheEntry) {
    gradeHash = gradeCacheEntry.hash;
    gradeBuffer = gradeCacheEntry.buffer;
  } else {
    const { src: gradeFile } = GRADE_SVG_MAP[grade];

    gradeBuffer = await sharp(path.resolve(`./public${gradeFile}`))
      .resize(240)
      .toBuffer();

    gradeHash = createHash("md5").update(gradeBuffer).digest("hex");

    gradeCache[grade] = { buffer: gradeBuffer, hash: gradeHash };
  }

  return { buffer: gradeBuffer, hash: gradeHash };
}

async function getReviewOpenGraphImage({
  authors,
  coverSlug,
  grade,
  title,
}: {
  authors: {
    name: string;
    notes: string | undefined;
  }[];
  coverSlug: string;
  grade: GradeText;
  title: string;
}): Promise<Buffer> {
  const coverBuffer = await fs.readFile(
    `./content/assets/covers/${coverSlug}.png`,
  );

  let coverHeight = 630;
  let coverWidth = await getCoverWidth(coverBuffer, coverHeight);

  if (coverWidth > 500) {
    coverHeight = await getCoverHeight(coverBuffer, 500);
    coverWidth = 500;
  }

  const coverHash = createHash("md5").update(coverBuffer).digest("hex");

  const gradeBuffer = await getGradeBuffer(grade);

  const cacheProps = gradeBuffer
    ? {
        authors,
        coverHash,
        gradeBuffer: gradeBuffer.hash,
        sourceComponentHash,
        title,
      }
    : {
        authors,
        coverHash,
        sourceComponentHash,
        title,
      };

  console.log(cacheProps);

  const cacheDigest = createHash("md5")
    .update(JSON.stringify(cacheProps))
    .digest("hex");

  const cacheFilePath = new URL(
    `${coverSlug}.${cacheDigest}.jpg`,
    assetsCacheDir,
  );

  const cached = await fs
    .readFile(cacheFilePath)
    .catch((error: Error & { code: unknown }) => {
      if (error.code !== "ENOENT") {
        throw new Error(
          `An error was encountered while reading the cache file. Error: ${error}`,
        );
      }
    });

  if (cached) {
    console.log(` (reused cache entry)`);
    return cached;
  }

  const cover = await sharp(coverBuffer).toBuffer();

  const fetchedResources = [
    {
      data: new Uint8Array(cover).buffer,
      src: "cover",
    },
  ];

  if (gradeBuffer) {
    fetchedResources.push({
      data: new Uint8Array(gradeBuffer.buffer).buffer,
      src: "grade",
    });
  }

  console.log(fetchedResources);

  const heroImage = await componentToImageBytes(
    <ReviewOpenGraphImage
      authors={authors}
      coverHeight={coverHeight}
      coverWidth={coverWidth}
      grade={grade}
      title={title}
    />,
    fetchedResources,
  );

  await fs.writeFile(cacheFilePath, heroImage);

  return heroImage;
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
  grade: GradeText;
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
          by {formatTitleAuthors(authors)}
        </div>
        {grade === "Abandoned" ? (
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
        ) : (
          <img
            height={48}
            src="grade"
            style={{ marginTop: "36px" }}
            width={240}
          />
        )}
      </div>
    </div>
  );
}
