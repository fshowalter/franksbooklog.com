import { SchemaNames } from "../schemaNames";
import { GatsbyNodeContext } from "../type-definitions";
import { WorkNode } from "./WorksJson";

export const ProgressJson = {
  name: SchemaNames.ProgressJson,
  interfaces: ["Node"],
  fields: {
    workSlug: "String!",
    sequence: "Int!",
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
    title: {
      type: `String!`,
      extensions: {
        proxyToWork: {
          fieldName: "title",
        },
      },
    },
    kind: {
      type: `String!`,
      extensions: {
        proxyToWork: {
          fieldName: "kind",
        },
      },
    },
    authors: {
      type: `[${SchemaNames.WorkAuthor}!]!`,
      extensions: {
        proxyToWork: {
          fieldName: "authors",
        },
      },
    },
    yearPublished: {
      type: `Int!`,
      extensions: {
        proxyToWork: {
          fieldName: "yearPublished",
        },
      },
    },
    cover: {
      type: `File!`,
      extensions: {
        proxyToWork: {
          fieldName: "cover",
        },
      },
    },
    work: {
      type: `${SchemaNames.WorksJson}!`,
      resolve: async (
        source: WorkNode,
        _args: unknown,
        context: GatsbyNodeContext
      ) => {
        return await context.nodeModel.findOne({
          type: SchemaNames.WorksJson,
          query: {
            filter: {
              slug: {
                eq: source.workSlug,
              },
            },
          },
        });
      },
    },
  },
};
