import { SchemaNames } from "../schemaNames";

export const ReviewedWorkAuthor = {
  name: SchemaNames.ReviewedWorkAuthor,
  interfaces: ["Node"],
  fields: {
    slug: "String!",
    notes: "String",
    name: "String!",
    sortName: "String!",
  },
};
