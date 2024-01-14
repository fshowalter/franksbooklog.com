import { SchemaNames } from "../schemaNames";
import { coverResolver } from "./utils/coverResolver";

export const TimelineEntriesJsonAuthor = {
  name: SchemaNames.TimelineEntriesJsonAuthor,
  fields: {
    name: "String!",
  },
};

export const TimelineEntriesJson = {
  name: SchemaNames.TimelineEntriesJson,
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
    readingYear: "String!",
    reviewed: "Boolean!",
    title: `String!`,
    kind: `String!`,
    authors: `[${SchemaNames.TimelineEntriesJsonAuthor}!]!`,
    yearPublished: `String!`,
    cover: {
      type: `File!`,
      resolve: coverResolver,
    },
  },
};
