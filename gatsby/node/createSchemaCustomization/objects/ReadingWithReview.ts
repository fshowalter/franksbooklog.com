import { SchemaNames } from "../schemaNames";
import { ReadingsJson } from "./ReadingsJson";

export const ReadingWithReview = {
  name: SchemaNames.ReadingWithReview,
  interfaces: ["Node"],
  fields: {
    ...ReadingsJson.fields,
    review: {
      type: `${SchemaNames.MarkdownRemark}!`,
      extensions: {
        proxyToWork: {
          fieldName: "review",
        },
      },
    },
  },
};
