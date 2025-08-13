import { remark } from "remark";
import remarkGfm from "remark-gfm";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";

import { allPagesMarkdown } from "./data/pagesMarkdown";
import { allReviewedWorksJson } from "./data/reviewedWorksJson";
import { perfLogger } from "./data/utils/performanceLogger";
import { getHtml } from "./utils/markdown/getHtml";
import { removeFootnotes } from "./utils/markdown/removeFootnotes";

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
    const pages = await allPagesMarkdown();

    const matchingPage = pages.find((page) => {
      return page.slug === slug;
    })!;

    const reviewedWorksJson = await allReviewedWorksJson();

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
