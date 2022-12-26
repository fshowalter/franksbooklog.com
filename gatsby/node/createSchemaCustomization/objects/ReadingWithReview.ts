import { SchemaNames } from "../schemaNames";
import { commonReadingFields } from "./ReadingsJson";

export const ReadingWithReview = {
  name: SchemaNames.ReadingWithReview,
  interfaces: ["Node"],
  fields: {
    ...commonReadingFields,
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
