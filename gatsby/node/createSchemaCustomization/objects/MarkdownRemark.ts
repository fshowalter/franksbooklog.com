import { Element } from "hast";
import toHtml from "hast-util-to-html";
import { SchemaNames } from "../schemaNames";
import type {
  GatsbyNode,
  GatsbyNodeContext,
  GatsbyResolveArgs,
  GatsbyResolveInfo,
} from "../type-definitions";
import { addWorkLinks } from "../utils/addWorkLinks";
import { resolveFieldForNode } from "../utils/resolveFieldForNode";
import { excerptHtmlFieldResolver } from "./fieldResolvers/excerptHtmlFieldResolver";

export interface MarkdownRemarkNode extends GatsbyNode {
  frontmatter: {
    work_slug: string;
    grade: string;
    date: string;
  };
}

export const MarkdownRemark = {
  name: SchemaNames.MarkdownRemark,
  interfaces: ["Node"],
  fields: {
    html: {
      type: "String!",
      extensions: {
        linkReviewedWorks: {},
      },
    },
    excerptHtml: excerptHtmlFieldResolver,
    linkedHtml: {
      type: "String",
      resolve: async (
        source: GatsbyNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo,
      ) => {
        const htmlAst = await resolveFieldForNode<Element>({
          fieldName: "htmlAst",
          source,
          context,
          info,
          args,
        });

        if (!htmlAst) {
          return null;
        }

        const html = toHtml(htmlAst, {
          allowDangerousHtml: true,
        });

        return addWorkLinks(html, context.nodeModel);
      },
    },
  },
};
