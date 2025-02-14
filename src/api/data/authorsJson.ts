import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";
import { nullableString } from "./utils/nullable";
import { WorkKindSchema } from "./WorkKindSchema";

const authorsJsonDirectory = getContentPath("data", "authors");

const WorkAuthorSchema = z
  .object({
    name: z.string(),
    notes: nullableString(),
    slug: z.string(),
    sortName: z.string(),
  })
  .transform(({ name, notes, slug, sortName }) => {
    // fix zod making anything with undefined optional
    return { name, notes, slug, sortName };
  });

const WorkSchema = z.object({
  authors: z.array(WorkAuthorSchema),
  grade: z.string(),
  gradeValue: z.number(),
  includedInSlugs: z.array(z.string()),
  kind: WorkKindSchema,
  slug: z.string(),
  sortTitle: z.string(),
  title: z.string(),
  yearPublished: z.string(),
});

const AuthorJsonSchema = z.object({
  name: z.string(),
  reviewedWorks: z.array(WorkSchema),
  slug: z.string(),
  sortName: z.string(),
});

export type AuthorJson = z.infer<typeof AuthorJsonSchema>;

export async function allAuthorsJson(): Promise<AuthorJson[]> {
  return await parseAllAuthorsJson();
}

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
