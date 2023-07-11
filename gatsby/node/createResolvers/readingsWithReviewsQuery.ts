import { SchemaNames } from "../createSchemaCustomization/schemaNames";
import type { GatsbyNodeContext } from "../createSchemaCustomization/type-definitions";

export const readingsWithReviewsQuery = {
  Query: {
    readingsWithReviews: {
      type: `[${SchemaNames.ReadingWithReview}!]!`,
      args: {
        limit: "Int",
        skip: "Int",
        sort: `${SchemaNames.ReadingWithReview}SortInput`,
      },
      resolve: async (
        _source: unknown,
        args: {
          limit?: number;
          skip?: number;
          sort?: {
            fields: string[];
            order: (boolean | "asc" | "desc" | "ASC" | "DESC")[];
          };
        },
        context: GatsbyNodeContext,
      ) => {
        const { limit = 0, skip = 0, sort } = args;

        const { fields = ["sequence"], order = ["DESC"] } = sort ?? {};

        const { entries } = await context.nodeModel.findAll({
          type: SchemaNames.ReadingsJson,
          query: {
            filter: { review: { id: { ne: null } } },
            limit: limit,
            skip: skip,
            sort: { fields: fields, order: order },
          },
        });

        return entries;
      },
    },
  },
};
