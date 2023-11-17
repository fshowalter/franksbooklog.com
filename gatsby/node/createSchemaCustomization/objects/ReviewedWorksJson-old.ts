import { SchemaNames } from "../schemaNames";
import type { GatsbyNodeContext, GatsbyResolveInfo } from "../type-definitions";
import { GatsbyNode } from "../type-definitions";
import { resolveFieldForNode } from "../utils/resolveFieldForNode";
import { sliceWorksForBrowseMore } from "../utils/sliceWorksForBrowseMore";
import { WorkNode } from "./WorksJson";

export interface ReviewedWorkNode extends GatsbyNode {
  includedWorks: string[];
  workSlug: string;
  work: WorkNode;
}

export const ReviewedWorksJson = {
  name: SchemaNames.ReviewedWorksJson,
  interfaces: ["Node"],
  fields: {
    workSlug: "String!",
    reviewDate: {
      type: `Date!`,
      extensions: {
        dateformat: {},
      },
    },
    grade: `String!`,
    gradeValue: `Int!`,
    reviewYear: `Int!`,
    title: {
      type: `String!`,
      extensions: {
        proxyToWork: {
          fieldName: "title",
        },
      },
    },
    subtitle: {
      type: `String`,
      extensions: {
        proxyToWork: {
          fieldName: "subtitle",
        },
      },
    },
    slug: {
      type: `String!`,
      extensions: {
        proxyToWork: {
          fieldName: "slug",
        },
      },
    },
    kind: {
      type: `String!`,
      extensions: {
        proxyToWork: {
          fieldName: "kind",
        },
      },
    },
    sortTitle: {
      type: `String!`,
      extensions: {
        proxyToWork: {
          fieldName: "sortTitle",
        },
      },
    },
    yearPublished: {
      type: `Int!`,
      extensions: {
        proxyToWork: {
          fieldName: "yearPublished",
        },
      },
    },
    authors: {
      type: `[${SchemaNames.WorkAuthor}!]!`,
      extensions: {
        proxyToWork: {
          fieldName: "authors",
        },
      },
    },
    cover: {
      type: `File!`,
      extensions: {
        proxyToWork: {
          fieldName: "cover",
        },
      },
    },
    readings: {
      type: `[${SchemaNames.ReadingsJson}!]!`,
      extensions: {
        proxyToWork: {
          fieldName: "readings",
        },
      },
    },
    work: {
      type: `${SchemaNames.WorksJson}!`,
      resolve: async (
        source: ReviewedWorkNode,
        _args: unknown,
        context: GatsbyNodeContext,
      ) => {
        return await context.nodeModel.findOne({
          type: SchemaNames.WorksJson,
          query: {
            filter: {
              slug: {
                eq: source.workSlug,
              },
            },
          },
        });
      },
    },
    review: {
      type: `${SchemaNames.MarkdownRemark}!`,
      resolve: async (
        source: ReviewedWorkNode,
        _args: unknown,
        context: GatsbyNodeContext,
      ) => {
        return await context.nodeModel.findOne({
          type: SchemaNames.MarkdownRemark,
          query: {
            filter: {
              frontmatter: {
                work_slug: {
                  eq: source.workSlug,
                },
              },
            },
          },
        });
      },
    },
    includedWorks: {
      type: `[${SchemaNames.ReviewedWorksJson}!]!`,
      resolve: async (
        source: ReviewedWorkNode,
        _args: unknown,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo,
      ) => {
        const work = await resolveFieldForNode<WorkNode>({
          fieldName: "work",
          source,
          context,
          info,
        });

        if (!work) {
          return [];
        }

        const { entries } = await context.nodeModel.findAll({
          type: SchemaNames.ReviewedWorksJson,
          query: {
            filter: {
              slug: {
                in: work.includedWorks,
              },
            },
          },
        });

        return entries;
      },
    },
    browseMore: {
      type: `[${SchemaNames.ReviewedWorksJson}!]!`,
      resolve: async (
        source: ReviewedWorkNode,
        _args: unknown,
        context: GatsbyNodeContext,
      ) => {
        const { entries } = await context.nodeModel.findAll<ReviewedWorkNode>({
          type: SchemaNames.ReviewedWorksJson,
          query: {
            sort: {
              fields: ["work.sortTitle"],
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
