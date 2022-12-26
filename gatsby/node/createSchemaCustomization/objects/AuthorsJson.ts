import path from "path";
import { SchemaNames } from "../schemaNames";
import type {
  GatsbyNode,
  GatsbyNodeContext,
  GatsbyResolveArgs,
  GatsbyResolveInfo,
} from "../type-definitions";
import { resolveFieldForNode } from "../utils/resolveFieldForNode";
import { WorkNode } from "./WorksJson";

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

        return source.slug;
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
              order: ["DESC"],
            },
          },
        });

        return entries;
      },
    },
    reviewedWorkCount: {
      type: `Int!`,
      resolve: async (
        source: AuthorNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const works = await resolveFieldForNode<WorkNode[]>(
          "works",
          source,
          context,
          info,
          args
        );

        if (!works) {
          return 0;
        }

        const workSlugs = Array.from(works.map((work) => work.slug));

        const { totalCount } = await context.nodeModel.findAll({
          type: SchemaNames.MarkdownRemark,
          query: {
            filter: {
              frontmatter: {
                work_slug: { in: workSlugs },
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
