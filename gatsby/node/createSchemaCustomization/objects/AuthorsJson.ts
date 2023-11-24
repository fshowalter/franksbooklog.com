import path from "path";
import { SchemaNames } from "../schemaNames";
import type { GatsbyNode, GatsbyNodeContext } from "../type-definitions";
import { coverResolver } from "./utils/coverResolver";

export interface AuthorNode extends GatsbyNode {
  slug: string;
}

export const AuthorsJsonWorkAuthor = {
  name: SchemaNames.AuthorsJsonWorkAuthor,
  fields: {
    slug: "String!",
    notes: "String",
    name: "String!",
    sortName: "String!",
  },
};

export const AuthorsJsonWork = {
  name: SchemaNames.AuthorsJsonWork,
  fields: {
    title: "String!",
    yearPublished: "String!",
    sortTitle: "String!",
    kind: "String!",
    slug: "String!",
    reviewed: "Boolean!",
    authors: `[${SchemaNames.AuthorsJsonWorkAuthor}!]!`,
    grade: "String",
    gradeValue: "Int",
    cover: {
      type: "File!",
      resolve: coverResolver,
    },
  },
};

export const AuthorsJson = {
  name: SchemaNames.AuthorsJson,
  interfaces: ["Node"],
  fields: {
    name: "String!",
    sortName: "String!",
    slug: "String!",
    works: `[${SchemaNames.AuthorsJsonWork}!]!`,
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
