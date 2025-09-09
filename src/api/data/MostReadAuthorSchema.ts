import { z } from "zod";

/**
 * Zod schema for individual reading entries within most read author data.
 * Represents a single book/work read by the author with metadata.
 */
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

/**
 * Zod schema for most read author statistics data.
 * Includes reading count, author details, and associated readings.
 */
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

/**
 * Type for most read author statistics data
 */
export type MostReadAuthor = z.infer<typeof MostReadAuthorSchema>;
