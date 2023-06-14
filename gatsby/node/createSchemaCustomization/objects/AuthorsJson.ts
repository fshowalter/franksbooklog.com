import path from "path";
import { SchemaNames } from "../schemaNames";
import type {
  GatsbyNode,
  GatsbyNodeContext,
  GatsbyResolveArgs,
  GatsbyResolveInfo,
} from "../type-definitions";
import { resolveFieldForNode } from "../utils/resolveFieldForNode";

export interface AuthorNode extends GatsbyNode {
  slug: string;
  name: string;
  sortName: string;
}

export const AuthorsJson = {
  name: SchemaNames.AuthorsJson,
  interfaces: ["Node"],
  fields: {
    name: "String!",
    sortName: "String!",
    slug: "String!",
    hasReviews: {
      type: "Boolean!",
      resolve: async (
        source: AuthorNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const reviewedWorkCount = await resolveFieldForNode<number>({
          fieldName: "reviewedWorkCount",
          source,
          context,
          info,
          args,
        });

        if (!reviewedWorkCount || reviewedWorkCount === 0) {
          return false;
        }

        return true;
      },
    },
    works: {
      type: `[${SchemaNames.WorksJson}!]!`,
      resolve: async (
        source: AuthorNode,
        _args: unknown,
        context: GatsbyNodeContext
      ) => {
        const { entries } = await context.nodeModel.findAll({
          type: SchemaNames.WorksJson,
          query: {
            filter: {
              authors: {
                elemMatch: { slug: { eq: source.slug } },
              },
            },
            sort: {
              fields: ["yearPublished"],
              order: ["ASC"],
            },
          },
        });

        return entries;
      },
    },
    readings: {
      type: `[${SchemaNames.ReadingsJson}!]!`,
      resolve: async (
        source: AuthorNode,
        _args: unknown,
        context: GatsbyNodeContext
      ) => {
        const { entries } = await context.nodeModel.findAll({
          type: SchemaNames.ReadingsJson,
          query: {
            filter: {
              authors: {
                elemMatch: { slug: { eq: source.slug } },
              },
            },
          },
        });

        return entries;
      },
    },
    readingCount: {
      type: `Int!`,
      args: {
        year: "Int",
      },
      resolve: async (
        source: AuthorNode,
        args: {
          year: number;
        },
        context: GatsbyNodeContext
      ) => {
        const { year } = args;

        const yearFilter = year ? { yearFinished: { eq: year } } : {};

        const { totalCount } = await context.nodeModel.findAll({
          type: SchemaNames.ReadingsJson,
          query: {
            filter: {
              authors: {
                elemMatch: { key: { eq: source.slug } },
              },
              ...yearFilter,
            },
          },
        });

        return totalCount();
      },
    },
    reviewedWorkCount: {
      type: `Int!`,
      resolve: async (
        source: AuthorNode,
        _args: GatsbyResolveArgs,
        context: GatsbyNodeContext
      ) => {
        const { totalCount } = await context.nodeModel.findAll({
          type: SchemaNames.WorksJson,
          query: {
            filter: {
              authors: {
                elemMatch: {
                  slug: {
                    in: [source.slug],
                  },
                },
              },
              review: { id: { ne: null } },
            },
          },
        });

        return await totalCount();
      },
    },
    workCount: {
      type: `Int!`,
      resolve: async (
        source: AuthorNode,
        _args: GatsbyResolveArgs,
        context: GatsbyNodeContext
      ) => {
        const { totalCount } = await context.nodeModel.findAll({
          type: SchemaNames.WorksJson,
          query: {
            filter: {
              authors: {
                elemMatch: {
                  slug: {
                    in: [source.slug],
                  },
                },
              },
            },
          },
        });

        return await totalCount();
      },
    },
    avatar: {
      type: "File",
      resolve: async (
        source: AuthorNode,
        _args: unknown,
        context: GatsbyNodeContext
      ) => {
        return await context.nodeModel.findOne({
          type: "File",
          query: {
            filter: {
              absolutePath: {
                eq: path.resolve(`./content/assets/avatars/${source.slug}.png`),
              },
            },
          },
        });
      },
    },
  },
  extensions: {
    infer: false,
  },
};
