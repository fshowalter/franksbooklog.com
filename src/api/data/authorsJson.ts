import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";
import { WorkKindSchema } from "./utils/workKindSchema";

const authorsJsonDirectory = getContentPath("data", "authors");

const WorkAuthorSchema = z.object({
  name: z.string(),
  notes: z.nullable(z.string()),
  slug: z.string(),
  sortName: z.string(),
});

const WorkSchema = z.object({
  authors: z.array(WorkAuthorSchema),
  grade: z.nullable(z.string()),
  gradeValue: z.nullable(z.number()),
  includedInSlugs: z.array(z.string()),
  kind: WorkKindSchema,
  reviewed: z.boolean(),
  slug: z.string(),
  sortTitle: z.string(),
  title: z.string(),
  yearPublished: z.string(),
});

const AuthorJsonSchema = z.object({
  name: z.string(),
  reviewedWorkCount: z.number(),
  shelfWorkCount: z.number(),
  slug: z.string(),
  sortName: z.string(),
  workCount: z.number(),
  works: z.array(WorkSchema),
});

async function parseAllAuthorsJson() {
  const dirents = await fs.readdir(authorsJsonDirectory, {
    withFileTypes: true,
  });

  return Promise.all(
    dirents
      .filter((entry) => !entry.isDirectory() && entry.name.endsWith(".json"))
      .map(async (entry) => {
        const fileContents = await fs.readFile(
          `${authorsJsonDirectory}/${entry.name}`,
          "utf8",
        );

        const json = JSON.parse(fileContents) as unknown;
        return AuthorJsonSchema.parse(json);
      }),
  );
}

export type AuthorJson = z.infer<typeof AuthorJsonSchema>;

export async function allAuthorsJson(): Promise<AuthorJson[]> {
  return await parseAllAuthorsJson();
}
