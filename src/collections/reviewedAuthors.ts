import type { LoaderContext } from "astro/loaders";

import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadJsonDirectory } from "./utils/loadJsonDirectory";

const ReviewedAuthorSchema = z.object({
  name: z.string(),
  reviewedWorks: z.array(reference("reviewedWorks")),
  slug: z.string(),
  sortName: z.string(),
});

export const reviewedAuthors = defineCollection({
  loader: {
    load: (loaderContext: LoaderContext) =>
      loadJsonDirectory({
        directoryPath: path.join(CONTENT_ROOT, "data", "reviewed-authors"),
        getId: (raw) => raw.slug as string,
        loaderContext,
      }),
    name: "reviewed-authors-loader",
  },
  schema: ReviewedAuthorSchema,
});
