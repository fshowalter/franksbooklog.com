import type { CreateSchemaCustomizationArgs } from "gatsby";
import AuthorsJson from "./schema/AuthorsJson";
import MarkdownRemark from "./schema/MarkdownRemark";
import WorkAuthor from "./schema/WorkAuthor";
import WorksJson from "./schema/WorksJson";

export default function createSchemaCustomization({
  actions,
  schema,
}: CreateSchemaCustomizationArgs) {
  const { createTypes } = actions;
  const typeDefs = [
    schema.buildObjectType(WorkAuthor),
    schema.buildObjectType(MarkdownRemark),
    schema.buildObjectType(WorksJson),
    schema.buildObjectType(AuthorsJson),
  ];

  createTypes(typeDefs);
}
