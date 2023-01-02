import { SchemaNames } from "../createSchemaCustomization/schemaNames";
import type { GatsbyNodeContext } from "../createSchemaCustomization/type-definitions";

export const shelfAuthorQuery = {
  Query: {
    shelfAuthor: {
      type: `${SchemaNames.AuthorsJson}!`,
      args: {
        id: "String!",
      },
      resolve: (
        _source: unknown,
        args: {
          id: string;
        },
        context: GatsbyNodeContext
      ) => {
        return context.nodeModel.getNodeById({
          id: args.id,
        });
      },
    },
  },
};
