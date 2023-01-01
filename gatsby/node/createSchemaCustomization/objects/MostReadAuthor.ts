import { SchemaNames } from "../schemaNames";
import { ReadingNode } from "./ReadingsJson";

export interface MostReadAuthorNode {
  name: string;
  slug: string | null;
  count: number;
  readings: ReadingNode[];
}

export const MostReadAuthor = {
  name: SchemaNames.MostReadAuthor,
  interfaces: ["Node"],
  fields: {
    name: "String!",
    slug: "String",
    count: "Int!",
    readings: `[${SchemaNames.ReadingsJson}!]!`,
  },
};
