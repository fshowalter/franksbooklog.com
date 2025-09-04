import { z } from "zod";

const MostReadAuthorReadingSchema = z.object({
  date: z.string(),
  edition: z.string(),
  includedInSlugs: z.array(z.string()),
  kind: z.string(),
  readingSequence: z.number(),
  reviewed: z.boolean(),
  slug: z.string(),
  title: z.string(),
  workYear: z.string(),
});

export const MostReadAuthorSchema = z
  .object({
    count: z.number(),
    name: z.string(),
    readings: z.array(MostReadAuthorReadingSchema),
    reviewed: z.boolean(),
    slug: z.string(),
  })
  .transform(({ count, name, readings, reviewed, slug }) => {
    // fix zod making anything with undefined optional
    return { count, name, readings, reviewed, slug };
  });

export type MostReadAuthor = z.infer<typeof MostReadAuthorSchema>;
