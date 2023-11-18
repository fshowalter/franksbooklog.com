import path from "path";
import { SchemaNames } from "../schemaNames";
import type { GatsbyNode, GatsbyNodeContext } from "../type-definitions";

export interface AuthorNode extends GatsbyNode {
  slug: string;
}

export const AuthorWork = {
  name: SchemaNames.AuthorWork,
  interfaces: ["Node"],
  fields: {
    title: "String!",
    yearPublished: "String",
    sortTitle: "String!",
    kind: "String!",
    slug: "String!",
    reviewed: "Boolean!",
    authors: `[${SchemaNames.WorkAuthor}!]!`,
    grade: "String",
    gradeValue: "Int",
  },
};

export const AuthorsJson = {
  name: SchemaNames.AuthorsJson,
  interfaces: ["Node"],
  fields: {
    name: "String!",
    sortName: "String!",
    slug: "String!",
    works: `[${SchemaNames.AuthorWork}!]!`,
    reviewedWorkCount: "Int!",
    workCount: "Int!",
    avatar: {
      type: "File",
      resolve: async (
        source: AuthorNode,
        _args: unknown,
        context: GatsbyNodeContext,
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
