import { SchemaNames } from "../schemaNames";
import type { GatsbyNodeContext } from "../type-definitions";
import { sliceWorksForBrowseMore } from "../utils/sliceWorksForBrowseMore";
import { WorkNode, WorksJson } from "./WorksJson";

export const ReviewedWork = {
  name: SchemaNames.ReviewedWork,
  interfaces: ["Node"],
  fields: {
    ...WorksJson.fields,
    slug: {
      type: `String!`,
      extensions: {
        proxyToReview: {
          fieldName: "workSlug",
        },
      },
    },
    review: {
      type: `${SchemaNames.MarkdownRemark}!`,
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
    includedWorks: {
      type: `[${SchemaNames.ReviewedWork}!]!`,
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
    browseMore: {
      type: `[${SchemaNames.WorksJson}!]!`,
      resolve: async (
        source: WorkNode,
        _args: unknown,
        context: GatsbyNodeContext
      ) => {
        const { entries } = await context.nodeModel.findAll<WorkNode>({
          type: SchemaNames.WorksJson,
          query: {
            filter: {
              slug: { ne: null },
            },
            sort: {
              fields: ["sortTitle"],
              order: ["ASC"],
            },
          },
        });

        return sliceWorksForBrowseMore(Array.from(entries), source.id);
      },
    },
  },
  extensions: {
    infer: false,
  },
};
