import { SchemaNames } from "../schemaNames";
import { coverResolver } from "./utils/coverResolver";

export const ReadingStatsJsonMostReadAuthorReading = {
  name: SchemaNames.ReadingStatsJsonMostReadAuthorReading,
  fields: {
    sequence: "Int!",
    date: {
      type: "Date!",
      extensions: {
        dateformat: {},
      },
    },
    slug: "String!",
    edition: "String!",
    kind: "String!",
    title: "String!",
    yearPublished: "String!",
    includedInSlugs: `[String!]!`,
    cover: {
      type: "File!",
      resolve: coverResolver,
    },
  },
};

export const ReadingStatsJsonMostReadAuthor = {
  name: SchemaNames.ReadingStatsJsonMostReadAuthor,
  fields: {
    name: "String!",
    count: "Int!",
    slug: "String!",
    readings: `[${SchemaNames.ReadingStatsJsonMostReadAuthorReading}!]!`,
  },
};

export const ReadingStatsJsonDistribution = {
  name: SchemaNames.ReadingStatsJsonDistribution,
  fields: {
    name: "String!",
    count: "Int!",
  },
};

export const ReadingStatsJson = {
  name: SchemaNames.ReadingStatsJson,
  interfaces: ["Node"],
  fields: {
    span: "String!",
    reviews: "Int!",
    readWorks: "Int!",
    books: "Int!",
    gradeDistribution: `[${SchemaNames.ReadingStatsJsonDistribution}!]!`,
    kindDistribution: `[${SchemaNames.ReadingStatsJsonDistribution}!]!`,
    editionDistribution: `[${SchemaNames.ReadingStatsJsonDistribution}!]!`,
    decadeDistribution: `[${SchemaNames.ReadingStatsJsonDistribution}!]!`,
    mostReadAuthors: `[${SchemaNames.ReadingStatsJsonMostReadAuthor}!]!`,
  },
};
