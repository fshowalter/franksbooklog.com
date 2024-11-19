import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";
import { nullableString } from "./utils/nullable";

const worksJsonFile = getContentPath("data", "works.json");

const AuthorSchema = z
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

const WorkJsonSchema = z
  .object({
    authors: z.array(AuthorSchema),
    includedInSlugs: z.array(z.string()),
    includedWorkSlugs: z.array(z.string()),
    slug: z.string(),
    subtitle: nullableString(),
    title: z.string(),
  })
  .transform(
    ({
      authors,
      includedInSlugs,
      includedWorkSlugs,
      slug,
      subtitle,
      title,
    }) => {
      // fix zod making anything with undefined optional
      return {
        authors,
        includedInSlugs,
        includedWorkSlugs,
        slug,
        subtitle,
        title,
      };
    },
  );

export type WorkJson = z.infer<typeof WorkJsonSchema>;

export async function allWorksJson(): Promise<WorkJson[]> {
  return await parseAllWorksJson();
}

async function parseAllWorksJson() {
  const json = await fs.readFile(worksJsonFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return data.map((item) => {
    return WorkJsonSchema.parse(item);
  });
}
