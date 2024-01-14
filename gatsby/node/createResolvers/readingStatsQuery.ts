import { SchemaNames } from "../createSchemaCustomization/schemaNames";
import type { GatsbyNodeContext } from "../createSchemaCustomization/type-definitions";

export const readingStatsQuery = {
  Query: {
    readingStats: {
      type: `${SchemaNames.ReadingStatsJson}!`,
      args: {
        span: "String!",
      },
      resolve: async (
        _source: unknown,
        args: {
          span: string;
        },
        context: GatsbyNodeContext,
      ) => {
        return context.nodeModel.findOne({
          type: SchemaNames.ReadingStatsJson,
          query: { filter: { span: { eq: args.span } } },
        });
      },
    },
  },
};
