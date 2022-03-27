import type { AuthorNode } from "./AuthorsJson";
import { SchemaNames } from "./schemaNames";
import type { GatsbyNodeContext } from "./type-definitions";

export interface WorkAuthorNode {
  name: string;
  sort_name: string;
  slug: string;
  reviewed: boolean;
  notes: string;
}

const WorkAuthor = {
  name: SchemaNames.WORK_AUTHOR,
  interfaces: ["Node"],
  fields: {
    slug: "String!",
    notes: "String",
    name: {
      type: "String!",
      resolve: async (
        source: WorkAuthorNode,
        _args: unknown,
        context: GatsbyNodeContext
      ) => {
        const { name } = await context.nodeModel.findOne<AuthorNode>({
          type: SchemaNames.AUTHORS_JSON,
          query: {
            filter: {
              slug: { eq: source.slug },
            },
          },
        });

        return name;
      },
    },
    sort_name: {
      type: "String!",
      resolve: async (
        source: WorkAuthorNode,
        _args: unknown,
        context: GatsbyNodeContext
      ) => {
        const { sort_name } = await context.nodeModel.findOne<AuthorNode>({
          type: SchemaNames.AUTHORS_JSON,
          query: {
            filter: {
              slug: { eq: source.slug },
            },
          },
        });

        return sort_name;
      },
    },
    reviewed: {
      type: "Boolean!",
      resolve: async (
        source: WorkAuthorNode,
        _args: unknown,
        context: GatsbyNodeContext
      ) => {
        const { reviewed } = await context.nodeModel.findOne<AuthorNode>({
          type: SchemaNames.AUTHORS_JSON,
          query: {
            filter: {
              slug: { eq: source.slug },
            },
          },
        });

        return reviewed;
      },
    },
  },
};

export default WorkAuthor;
