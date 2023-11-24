import { Element } from "hast";
import toHtml from "hast-util-to-html";
import { Parent } from "unist";
import visit from "unist-util-visit";
import type {
  GatsbyNodeContext,
  GatsbyResolveInfo,
} from "../../type-definitions";
import { MarkdownRemarkNode } from "../MarkdownRemark";
import { resolveFieldForNode } from "./resolveFieldForNode";

export const excerptHtmlField = {
  type: "String",
  args: {
    includeCssClass: {
      type: "Boolean",
      defaultValue: true,
    },
  },
  resolve: async (
    source: MarkdownRemarkNode,
    _args: Record<string, unknown>,
    context: GatsbyNodeContext,
    info: GatsbyResolveInfo,
  ) => {
    const rawMarkdownBody = await resolveFieldForNode<string>({
      fieldName: "rawMarkdownBody",
      source,
      context,
      info,
      args: { format: "HTML", pruneLength: 20000, truncate: false },
    });

    if (!rawMarkdownBody) {
      return null;
    }

    const hasExcerptBreak = rawMarkdownBody.includes("<!-- end -->");

    const excerptAst = await resolveFieldForNode<Element>({
      fieldName: "excerptAst",
      source,
      context,
      info,
      args: { pruneLength: 20000, truncate: false },
    });

    if (!excerptAst) {
      return null;
    }

    removeFootnotes(excerptAst);

    let excerpt = toHtml(excerptAst, {
      allowDangerousHtml: true,
    });

    if (hasExcerptBreak) {
      excerpt = excerpt.replace(/\n+$/, "");
      excerpt = excerpt.replace(
        /<\/p>$/,
        ` <a data-continue-reading href="/reviews/${source.frontmatter.work_slug}/">Continue reading...</a></p>`,
      );
    }

    return excerpt;
  },
  extensions: {
    linkReviewedWorks: {},
  },
};

function removeFootnotes(element: Element) {
  visit(
    element,
    "element",
    function (
      element: Element,
      index: number | null,
      parent: Parent | undefined,
    ) {
      if (
        parent &&
        index &&
        element.tagName === "div" &&
        element.properties &&
        element.properties.className &&
        typeof element.properties.className === "string" &&
        element.properties.className.includes("footnotes")
      ) {
        parent.children.splice(index, 1);
        return [visit.SKIP, index];
      }

      if (
        parent &&
        index &&
        element.tagName === "sup" &&
        element.properties &&
        element.properties.id &&
        typeof element.properties.id === "string" &&
        element.properties.id.startsWith("fnref-")
      ) {
        parent.children.splice(index, 1);
        return [visit.SKIP, index];
      }
    },
  );

  return element;
}
