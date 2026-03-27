import type { LoaderContext } from "astro/loaders";

import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadJsonSplitFile } from "./utils/loadJsonSplitFile";

const ReadingLogWorkAuthorSchema = z
  .object({
    name: z.string(),
    notes: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
  })
  .transform(({ name, notes }) => {
    // fix zod making anything with undefined optional
    return { name, notes };
  });

const ReadingLogSchema = z
  .object({
    authors: z.array(ReadingLogWorkAuthorSchema),
    date: z.coerce.date(),
    edition: z.string(),
    id: z.string(),
    kind: z.string(),
    progress: z.string(),
    reviewSlug: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    sequence: z.string(),
    title: z.string(),
    titleYear: z.string(),
  })
  .transform(
    ({
      authors,
      date,
      edition,
      id,
      kind,
      progress,
      reviewSlug,
      sequence,
      title,
      titleYear,
    }) => {
      // fix zod making anything with undefined optional
      return {
        authors,
        date,
        edition,
        id,
        kind,
        progress,
        reviewSlug,
        sequence,
        title,
        titleYear,
      };
    },
  );

export const readingLog = defineCollection({
  loader: {
    load: (loaderContext: LoaderContext) =>
      loadJsonSplitFile({
        directoryPath: path.join(CONTENT_ROOT, "data", "reading-log"),
        loaderContext,
      }),
    name: "reading-log-loader",
  },
  schema: ReadingLogSchema,
});
