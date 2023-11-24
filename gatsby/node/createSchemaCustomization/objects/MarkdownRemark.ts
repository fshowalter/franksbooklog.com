import { Element } from "hast";
import toHtml from "hast-util-to-html";
import { SchemaNames } from "../schemaNames";
import type {
  GatsbyNode,
  GatsbyNodeContext,
  GatsbyResolveArgs,
  GatsbyResolveInfo,
} from "../type-definitions";
import { excerptHtmlField } from "./utils/excerptHtmlField";
import { resolveFieldForNode } from "./utils/resolveFieldForNode";

export interface MarkdownRemarkNode extends GatsbyNode {
  fileAbsolutePath: string;
  frontmatter: FrontMatter;
}

export interface FrontMatter {
  work_slug: string;
  grade: string | null;
  date: string;
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
    excerptHtml: excerptHtmlField,
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

        return toHtml(htmlAst, {
          allowDangerousHtml: true,
        });
      },
      extensions: {
        linkReviewedWorks: {},
      },
    },
    date: {
      type: "Date!",
      resolve: async (
        source: MarkdownRemarkNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo,
      ) => {
        const frontMatter = await resolveFieldForNode<FrontMatter>({
          fieldName: "frontmatter",
          source,
          context,
          info,
          args,
        });

        return frontMatter ? frontMatter.date : null;
      },
      extensions: {
        dateformat: {},
      },
    },
    grade: {
      type: "String!",
      resolve: async (
        source: MarkdownRemarkNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo,
      ) => {
        const frontMatter = await resolveFieldForNode<FrontMatter>({
          fieldName: "frontmatter",
          source,
          context,
          info,
          args,
        });

        return frontMatter ? frontMatter.grade : null;
      },
    },
  },
};
