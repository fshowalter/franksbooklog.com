import path from "path";
import { SchemaNames } from "../schemaNames";
import type {
  GatsbyNode,
  GatsbyNodeContext,
  GatsbyResolveArgs,
  GatsbyResolveInfo,
} from "../type-definitions";
import findDefaultCoverNode from "../utils/findDefaultCoverNode";
import { resolveFieldForNode } from "../utils/resolveFieldForNode";
import { ReadingNode } from "./ReadingsJson";

export interface WorkNode extends GatsbyNode {
  slug: string;
  includedWorks: string[];
  shelf: boolean;
  yearPublished: number;
}

export const WorksJson = {
  name: SchemaNames.WorksJson,
  interfaces: ["Node"],
  fields: {
    title: "String!",
    subtitle: "String",
    yearPublished: "Int!",
    sortTitle: "String!",
    shelf: "Boolean!",
    slug: {
      type: `String`,
      extensions: {
        proxyToReview: {
          fieldName: "workSlug",
        },
      },
    },
    grade: {
      type: `String`,
      extensions: {
        proxyToReview: {
          fieldName: "grade",
        },
      },
    },
    gradeValue: {
      type: `Int`,
      extensions: {
        proxyToReview: {
          fieldName: "gradeValue",
        },
      },
    },
    kind: `${SchemaNames.WorkKind}!`,
    authors: `[${SchemaNames.WorkAuthor}!]!`,
    decadePublished: {
      type: "String!",
      resolve: (source: WorkNode) => {
        return `${source.yearPublished.toString().substring(0, 3)}0s`;
      },
    },
    includedWorks: {
      type: `[${SchemaNames.WorksJson}!]!`,
      resolve: async (
        source: WorkNode,
        _args: unknown,
        context: GatsbyNodeContext
      ) => {
        const { entries } = await context.nodeModel.findAll({
          type: SchemaNames.WorksJson,
          query: {
            filter: {
              slug: {
                in: source.includedWorks,
              },
            },
          },
        });

        return Array.from(entries);
      },
    },
    review: {
      type: SchemaNames.MarkdownRemark,
      resolve: async (
        source: WorkNode,
        _args: unknown,
        context: GatsbyNodeContext
      ) => {
        return await context.nodeModel.findOne({
          type: SchemaNames.MarkdownRemark,
          query: {
            filter: {
              frontmatter: {
                work_slug: {
                  eq: source.slug,
                },
              },
            },
          },
        });
      },
    },
    readings: {
      type: `[${SchemaNames.ReadingsJson}!]!`,
      resolve: async (
        source: WorkNode,
        _args: unknown,
        context: GatsbyNodeContext
      ) => {
        const { entries } = await context.nodeModel.findAll<ReadingNode>({
          type: SchemaNames.ReadingsJson,
          query: {
            filter: {
              workSlug: {
                eq: source.slug,
              },
            },
          },
        });

        return Array.from(entries);
      },
    },
    cover: {
      type: "File!",
      resolve: async (
        source: WorkNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
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

        if (cover) {
          return cover;
        }

        const parentWork = await context.nodeModel.findOne<WorkNode>({
          type: SchemaNames.WorksJson,
          query: {
            filter: {
              includedWorks: { elemMatch: { slug: { eq: source.slug } } },
            },
          },
        });

        const parentCover = await resolveFieldForNode(
          "cover",
          parentWork,
          context,
          info,
          args
        );

        return parentCover || findDefaultCoverNode(context.nodeModel);
      },
    },
  },
  extensions: {
    infer: false,
  },
};
