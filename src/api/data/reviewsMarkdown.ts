import matter from "gray-matter";
import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const reviewsMarkdownDirectory = getContentPath("reviews");

export type MarkdownReview = {
  date: Date;
  grade: string;
  rawContent: string;
  slug: string;
};

const DataSchema = z.object({
  date: z.date(),
  grade: z.string(),
  work_slug: z.string(),
});

async function parseAllReviewsMarkdown(): Promise<MarkdownReview[]> {
  const dirents = await fs.readdir(reviewsMarkdownDirectory, {
    withFileTypes: true,
  });

  return Promise.all(
    dirents
      .filter((item) => !item.isDirectory() && item.name.endsWith(".md"))
      .map(async (item) => {
        const fileContents = await fs.readFile(
          `${reviewsMarkdownDirectory}/${item.name}`,
          "utf8",
        );

        const { content, data } = matter(fileContents);
        const greyMatter = DataSchema.parse(data);

        return {
          date: greyMatter.date,
          grade: greyMatter.grade,
          rawContent: content,
          slug: greyMatter.work_slug,
        };
      }),
  );
}

export async function allReviewsMarkdown(): Promise<MarkdownReview[]> {
  return await parseAllReviewsMarkdown();
}
