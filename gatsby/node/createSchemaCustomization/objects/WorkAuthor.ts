import { SchemaNames } from "../schemaNames";

export const WorkAuthor = {
  name: SchemaNames.WorkAuthor,
  fields: {
    slug: "String!",
    notes: "String",
    name: "String!",
    sortName: "String!",
  },
};
