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
  key: string;
  name: string;
  sortName: string;
}

export const AuthorsJson = {
  name: SchemaNames.AuthorsJson,
  interfaces: ["Node"],
  fields: {
    name: "String!",
    sortName: "String!",
    key: "String!",
    slug: {
      type: "String",
      resolve: async (
        source: AuthorNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const reviewedWorkCount = await resolveFieldForNode<number>(
          "reviewedWorkCount",
          source,
          context,
          info,
          args
        );

        if (!reviewedWorkCount || reviewedWorkCount === 0) {
          return null;
        }

        return source.key;
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
                elemMatch: { key: { eq: source.key } },
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
                elemMatch: { key: { eq: source.key } },
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
                elemMatch: { key: { eq: source.key } },
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
                  key: {
                    in: [source.key],
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
                  key: {
                    in: [source.key],
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
                eq: path.resolve(`./content/assets/avatars/${source.key}.png`),
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
