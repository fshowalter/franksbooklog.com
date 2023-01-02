import { SchemaNames } from "../schemaNames";
import type { GatsbyNodeContext } from "../type-definitions";
import type { AuthorNode } from "./AuthorsJson";

export interface WorkAuthorNode {
  key: string;
  notes: string;
}

async function findAuthor(context: GatsbyNodeContext, key: string) {
  return await context.nodeModel.findOne<AuthorNode>({
    type: SchemaNames.AuthorsJson,
    query: {
      filter: {
        key: { eq: key },
      },
    },
  });
}

export const WorkAuthor = {
  name: SchemaNames.WorkAuthor,
  interfaces: ["Node"],
  fields: {
    key: "String!",
    notes: "String",
    name: {
      type: "String!",
      resolve: async (
        source: WorkAuthorNode,
        _args: unknown,
        context: GatsbyNodeContext
      ) => {
        const author = await findAuthor(context, source.key);

        return author ? author.name : null;
      },
    },
    slug: {
      type: "String",
      resolve: async (
        source: WorkAuthorNode,
        _args: unknown,
        context: GatsbyNodeContext
      ) => {
        const author = await findAuthor(context, source.key);

        return author ? author.slug : null;
      },
    },
    sortName: {
      type: "String!",
      resolve: async (
        source: WorkAuthorNode,
        _args: unknown,
        context: GatsbyNodeContext
      ) => {
        const author = await findAuthor(context, source.key);

        return author ? author.sortName : null;
      },
    },
  },
};
