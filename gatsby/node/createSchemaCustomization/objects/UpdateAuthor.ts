import { SchemaNames } from "../schemaNames";

export const UpdateAuthor = {
  name: SchemaNames.UpdateAuthor,
  interfaces: ["Node"],
  fields: {
    slug: "String!",
    notes: "String",
    name: "String!",
  },
};
