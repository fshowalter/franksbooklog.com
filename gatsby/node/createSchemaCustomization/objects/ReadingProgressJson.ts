import { SchemaNames } from "../schemaNames";
import { coverResolver } from "./fieldResolvers/coverResolver";

export const ReadingProgressJson = {
  name: SchemaNames.ReadingProgressJson,
  interfaces: ["Node"],
  fields: {
    slug: "String!",
    sequence: "String!",
    edition: "String!",
    date: {
      type: "String!",
      extensions: {
        dateformat: {},
      },
    },
    progress: "String!",
    readingYear: "Int!",
    reviewed: "Boolean!",
    title: `String!`,
    kind: `String!`,
    authors: `[${SchemaNames.ReadingProgressAuthor}!]!`,
    yearPublished: `Int!`,
    cover: {
      type: `File!`,
      resolve: coverResolver,
    },
  },
};
