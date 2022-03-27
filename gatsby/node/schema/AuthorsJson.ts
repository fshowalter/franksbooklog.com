import path from "path";
import { SchemaNames } from "./schemaNames";
import type {
  GatsbyNode,
  GatsbyNodeContext,
  GatsbyResolveArgs,
  GatsbyResolveInfo,
} from "./type-definitions";
import resolveFieldForNode from "./utils/resolveFieldForNode";
import type { WorkNode } from "./WorksJson";

export interface AuthorNode extends GatsbyNode {
  slug: string;
  name: string;
  sort_name: string;
  reviewed: boolean;
}

const AuthorsJson = {
  name: SchemaNames.AUTHORS_JSON,
  interfaces: ["Node"],
  fields: {
    slug: "String!",
    name: "String!",
    sort_name: "String!",
    reviewed: "Boolean!",
    reviews: {
      type: `[${SchemaNames.MARKDOWN_REMARK}!]!`,
      resolve: async (
        source: AuthorNode,
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
    works: {
      type: `[${SchemaNames.WORKS_JSON}!]!`,
      resolve: async (
        source: AuthorNode,
        _args: unknown,
        context: GatsbyNodeContext
      ) => {
        const { entries } = await context.nodeModel.findAll({
          type: SchemaNames.WORKS_JSON,
          query: {
            filter: {
              authors: {
                elemMatch: { slug: { eq: source.slug } },
              },
            },
            sort: {
              fields: ["year"],
              order: ["DESC"],
            },
          },
        });

        return entries || [];
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
          type: SchemaNames.WORKS_JSON,
          query: {
            filter: {
              authors: {
                elemMatch: { slug: { eq: source.slug } },
              },
            },
          },
        });

        return await totalCount();
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
          type: SchemaNames.MARKDOWN_REMARK,
          query: {
            filter: {
              frontmatter: {
                slug: { in: workSlugs },
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

export default AuthorsJson;
