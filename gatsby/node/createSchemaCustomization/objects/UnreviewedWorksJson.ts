import { SchemaNames } from "../schemaNames";
import { coverResolver } from "./fieldResolvers/coverResolver";

export const UnreviewedWorksJson = {
  name: SchemaNames.UnreviewedWorksJson,
  interfaces: ["Node"],
  fields: {
    title: "String!",
    sortTitle: "String!",
    slug: "String!",
    includedInSlugs: "[String!]!",
    yearPublished: "Int!",
    kind: "String!",
    authors: {
      type: `[${SchemaNames.WorkAuthor}!]!`,
    },
    cover: {
      type: "File!",
      resolve: coverResolver,
    },
  },
  extensions: {
    infer: false,
  },
};
