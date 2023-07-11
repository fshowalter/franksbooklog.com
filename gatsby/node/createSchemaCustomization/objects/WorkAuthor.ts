import { SchemaNames } from "../schemaNames";
import type { GatsbyNodeContext } from "../type-definitions";
import type { AuthorNode } from "./AuthorsJson";

export interface WorkAuthorNode {
  slug: string;
  notes: string;
}

async function findAuthor(context: GatsbyNodeContext, slug: string) {
  return await context.nodeModel.findOne<AuthorNode>({
    type: SchemaNames.AuthorsJson,
    query: {
      filter: {
        slug: { eq: slug },
      },
    },
  });
}

export const WorkAuthor = {
  name: SchemaNames.WorkAuthor,
  interfaces: ["Node"],
  fields: {
    slug: "String!",
    notes: "String",
    name: {
      type: "String!",
      resolve: async (
        source: WorkAuthorNode,
        _args: unknown,
        context: GatsbyNodeContext,
      ) => {
        const author = await findAuthor(context, source.slug);

        return author ? author.name : null;
      },
    },
    sortName: {
      type: "String!",
      resolve: async (
        source: WorkAuthorNode,
        _args: unknown,
        context: GatsbyNodeContext,
      ) => {
        const author = await findAuthor(context, source.slug);

        return author ? author.sortName : null;
      },
    },
  },
};
