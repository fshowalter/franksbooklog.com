import { z } from "zod";

import { nullableString } from "./utils/nullable";

const MostReadAuthorReadingSchema = z.object({
  date: z.string(),
  edition: z.string(),
  includedInSlugs: z.array(z.string()),
  kind: z.string(),
  reviewed: z.boolean(),
  sequence: z.number(),
  slug: z.string(),
  title: z.string(),
  yearPublished: z.string(),
});

export const MostReadAuthorSchema = z
  .object({
    count: z.number(),
    name: z.string(),
    readings: z.array(MostReadAuthorReadingSchema),
    slug: nullableString(),
  })
  .transform(({ count, name, readings, slug }) => {
    // fix zod making anything with undefined optional
    return { count, name, readings, slug };
  });
