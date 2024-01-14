import { SchemaNames } from "../schemaNames";
import { coverResolver } from "./utils/coverResolver";

export const UnreviewedWorksJsonWorkAuthor = {
  name: SchemaNames.UnreviewedWorksJsonWorkAuthor,
  fields: {
    slug: "String!",
    notes: "String",
    name: "String!",
    sortName: "String!",
  },
};

export const UnreviewedWorksJson = {
  name: SchemaNames.UnreviewedWorksJson,
  interfaces: ["Node"],
  fields: {
    title: "String!",
    subtitle: "String",
    sortTitle: "String!",
    slug: "String!",
    includedInSlugs: "[String!]!",
    yearPublished: "String!",
    kind: "String!",
    authors: {
      type: `[${SchemaNames.UnreviewedWorksJsonWorkAuthor}!]!`,
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
