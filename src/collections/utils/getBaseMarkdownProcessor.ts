import { remark } from "remark";
import remarkGfm from "remark-gfm";
import smartypants from "remark-smartypants";

export function getBaseMarkdownProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}
