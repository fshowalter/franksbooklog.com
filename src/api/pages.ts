import { allPagesMarkdown } from "./data/pagesMarkdown";
import { allReviewedWorksJson } from "./data/reviewedWorksJson";
import { getHtml } from "./utils/markdown/getHtml";

type MarkdownPage = {
  content: null | string;
  title: string;
};

export async function getPage(slug: string): Promise<MarkdownPage> {
  const pages = await allPagesMarkdown();

  const matchingPage = pages.find((page) => {
    return page.slug === slug;
  })!;

  const reviewedWorksJson = await allReviewedWorksJson();

  return {
    content: getHtml(matchingPage.rawContent, reviewedWorksJson),
    title: matchingPage.title,
  };
}
