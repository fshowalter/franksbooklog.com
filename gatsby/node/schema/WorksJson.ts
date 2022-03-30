import path from "path";
import type { MarkdownNode } from "./MarkdownRemark";
import { SchemaNames } from "./schemaNames";
import type {
  GatsbyNode,
  GatsbyNodeContext,
  GatsbyResolveArgs,
  GatsbyResolveInfo,
} from "./type-definitions";
import findDefaultCoverNode from "./utils/findDefaultCoverNode";
import resolveFieldForNode from "./utils/resolveFieldForNode";

export interface WorkNode extends GatsbyNode {
  slug: string;
  reviewed: boolean;
}

async function resolveMostRecentReview(
  source: WorkNode,
  context: GatsbyNodeContext,
  info: GatsbyResolveInfo,
  args: GatsbyResolveArgs
) {
  const reviews = await resolveFieldForNode<MarkdownNode[]>(
    "reviews",
    source,
    context,
    info,
    args
  );

  if (!reviews) {
    return null;
  }

  return Array.from(reviews)[0];
}

const WorksJson = {
  name: SchemaNames.WORKS_JSON,
  interfaces: ["Node"],
  fields: {
    title: "String!",
    year: "Int!",
    sort_title: "String!",
    slug: "String!",
    kind: "String!",
    reviewed: "Boolean!",
    authors: "[WorkAuthor!]!",
    reviews: {
      type: `[${SchemaNames.MARKDOWN_REMARK}!]!`,
      resolve: async (
        source: WorkNode,
        _args: unknown,
        context: GatsbyNodeContext
      ) => {
        const { entries } = await context.nodeModel.findAll({
          type: SchemaNames.MARKDOWN_REMARK,
          query: {
            filter: {
              postType: {
                eq: "REVIEW",
              },
              frontmatter: {
                slug: { eq: source.slug },
              },
            },
            sort: {
              fields: ["frontmatter.sequence"],
              order: ["DESC"],
            },
          },
        });

        return entries;
      },
    },
    lastReviewDate: {
      type: "Date",
      extensions: {
        dateformat: {},
      },
      resolve: async (
        source: WorkNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const mostRecentReview = await resolveMostRecentReview(
          source,
          context,
          info,
          args
        );

        if (!mostRecentReview) {
          return null;
        }

        return await resolveFieldForNode(
          "dateFinished",
          mostRecentReview,
          context,
          info,
          args
        );
      },
    },
    lastReviewGrade: {
      type: "String",
      resolve: async (
        source: WorkNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const mostRecentReview = await resolveMostRecentReview(
          source,
          context,
          info,
          args
        );

        if (!mostRecentReview) {
          return null;
        }

        return mostRecentReview.frontmatter.grade;
      },
    },
    lastReviewGradeValue: {
      type: "Int",
      resolve: async (
        source: WorkNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const mostRecentReview = await resolveMostRecentReview(
          source,
          context,
          info,
          args
        );

        if (!mostRecentReview) {
          return null;
        }

        return resolveFieldForNode(
          "gradeValue",
          mostRecentReview,
          context,
          info,
          args
        );
      },
    },
    cover: {
      type: "File",
      resolve: async (
        source: WorkNode,
        _args: unknown,
        context: GatsbyNodeContext
      ) => {
        const cover = await context.nodeModel.findOne({
          type: "File",
          query: {
            filter: {
              absolutePath: {
                eq: path.resolve(`./content/assets/covers/${source.slug}.png`),
              },
            },
          },
        });

        return cover || findDefaultCoverNode(context.nodeModel);
      },
    },
  },
  extensions: {
    infer: false,
  },
};

export default WorksJson;
