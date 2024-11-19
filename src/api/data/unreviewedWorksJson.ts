import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";
import { nullableString } from "./utils/nullable";
import { WorkKindSchema } from "./WorkKindSchema";

const unreviewedWorksJsonFile = getContentPath("data", "unreviewed-works.json");

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

const UnreviewedWorkJsonSchema = z
  .object({
    authors: z.array(AuthorSchema),
    includedInSlugs: z.array(z.string()),
    kind: WorkKindSchema,
    slug: z.string(),
    sortTitle: z.string(),
    subtitle: nullableString(),
    title: z.string(),
    yearPublished: z.string(),
  })
  .transform(
    ({
      authors,
      includedInSlugs,
      kind,
      slug,
      sortTitle,
      subtitle,
      title,
      yearPublished,
    }) => {
      // fix zod making anything with undefined optional
      return {
        authors,
        includedInSlugs,
        kind,
        slug,
        sortTitle,
        subtitle,
        title,
        yearPublished,
      };
    },
  );

export type UnreviewedWorkJson = z.infer<typeof UnreviewedWorkJsonSchema>;

export async function allUnreviewedWorksJson(): Promise<UnreviewedWorkJson[]> {
  return await parseAllUnreviewedWorksJson();
}

async function parseAllUnreviewedWorksJson() {
  const json = await fs.readFile(unreviewedWorksJsonFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return data.map((item) => {
    return UnreviewedWorkJsonSchema.parse(item);
  });
}
