import { remark } from "remark";
import remarkGfm from "remark-gfm";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";

import { ENABLE_CACHE } from "~/utils/cache";
import { perfLogger } from "~/utils/performanceLogger";

import type { MarkdownPage as RawMarkdownPage } from "./data/pagesMarkdown";

import { allPagesMarkdown } from "./data/pagesMarkdown";
import {
  allReviewedWorksJson,
  type ReviewedWorkJson,
} from "./data/reviewedWorksJson";
import { getHtml } from "./utils/markdown/getHtml";
import { removeFootnotes } from "./utils/markdown/removeFootnotes";

let cachedPagesMarkdown: RawMarkdownPage[];
let cachedReviewedWorksJson: ReviewedWorkJson[];

type MarkdownPage = {
  content: string | undefined;
  rawContent: string;
  title: string;
};

export function getContentPlainText(rawContent: string): string {
  return getMastProcessor()
    .use(removeFootnotes)
    .use(strip)
    .processSync(rawContent)
    .toString();
}

export async function getPage(slug: string): Promise<MarkdownPage> {
  return await perfLogger.measure("getPage", async () => {
    const pages = cachedPagesMarkdown || (await allPagesMarkdown());
    if (ENABLE_CACHE && !cachedPagesMarkdown) {
      cachedPagesMarkdown = pages;
    }

    const matchingPage = pages.find((page) => {
      return page.slug === slug;
    })!;

    const reviewedWorksJson =
      cachedReviewedWorksJson || (await allReviewedWorksJson());
    if (ENABLE_CACHE && !cachedReviewedWorksJson) {
      cachedReviewedWorksJson = reviewedWorksJson;
    }

    return {
      content: getHtml(matchingPage.rawContent, reviewedWorksJson),
      rawContent: matchingPage?.rawContent || "",
      title: matchingPage.title,
    };
  });
}

function getMastProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}
