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
import valueForGrade from "../utils/valueForGrade";
import { excerptHtmlFieldResolver } from "./fieldResolvers/excerptHtmlFieldResolver";

export interface MarkdownRemarkNode extends GatsbyNode {
  fileAbsolutePath: string;
  frontmatter: FrontMatter;
}

interface FrontMatter {
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
    excerptHtml: excerptHtmlFieldResolver,
    kind: {
      type: `${SchemaNames.MarkdownNodeKind}!`,
      resolve: (source: MarkdownRemarkNode) => {
        if (source.fileAbsolutePath.includes("/reviews/")) {
          return "REVIEW";
        }

        return "OTHER";
      },
    },
    workSlug: {
      type: "String!",
      resolve: async (
        source: MarkdownRemarkNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const frontMatter = await resolveFieldForNode<FrontMatter>(
          "frontmatter",
          source,
          context,
          info,
          args
        );

        return frontMatter ? frontMatter.work_slug : null;
      },
    },
    date: {
      type: "Date!",
      resolve: async (
        source: MarkdownRemarkNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const frontMatter = await resolveFieldForNode<FrontMatter>(
          "frontmatter",
          source,
          context,
          info,
          args
        );

        return frontMatter ? frontMatter.date : null;
      },
      extensions: {
        dateformat: {},
      },
    },
    grade: {
      type: "String",
      resolve: async (
        source: MarkdownRemarkNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const frontMatter = await resolveFieldForNode<FrontMatter>(
          "frontmatter",
          source,
          context,
          info,
          args
        );

        return frontMatter ? frontMatter.grade : null;
      },
    },
    linkedHtml: {
      type: "String",
      resolve: async (
        source: MarkdownRemarkNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const frontMatter = await resolveFieldForNode<FrontMatter>(
          "frontmatter",
          source,
          context,
          info,
          args
        );

        if (!frontMatter) {
          return null;
        }

        const htmlAst = await resolveFieldForNode<Element>(
          "htmlAst",
          source,
          context,
          info,
          args
        );

        if (!htmlAst) {
          return null;
        }

        const html = toHtml(htmlAst, {
          allowDangerousHtml: true,
        });

        return addWorkLinks(html, context.nodeModel);
      },
    },
    gradeValue: {
      type: "Int",
      resolve: async (
        source: MarkdownRemarkNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const frontMatter = await resolveFieldForNode<FrontMatter>(
          "frontmatter",
          source,
          context,
          info,
          args
        );

        if (!frontMatter) {
          return null;
        }

        return valueForGrade(frontMatter.grade);
      },
    },
  },
};
