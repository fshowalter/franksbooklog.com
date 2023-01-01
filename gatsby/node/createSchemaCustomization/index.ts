import type { CreateSchemaCustomizationArgs } from "gatsby";
import { MarkdownNodeKindEnum } from "./enums/MarkdownNodeKindEnum";
import { WorkKindEnum } from "./enums/WorkKindEnum";
import { linkReviewedWorksExtension } from "./extensions/linkReviewedWorks";
import { proxyToReviewExtension } from "./extensions/proxyToReview";
import { proxyToWorkExtension } from "./extensions/proxyToWork";
import { AuthorsJson } from "./objects/AuthorsJson";
import { MarkdownRemark } from "./objects/MarkdownRemark";
import { MostReadAuthor } from "./objects/MostReadAuthor";
import { ReadingsJson } from "./objects/ReadingsJson";
import { ReadingWithReview } from "./objects/ReadingWithReview";
import { TimelineEntry } from "./objects/TimelineEntry";
import { WorkAuthor } from "./objects/WorkAuthor";
import { WorksJson } from "./objects/WorksJson";

export function createSchemaCustomization({
  actions,
  schema,
}: CreateSchemaCustomizationArgs) {
  const { createTypes, createFieldExtension } = actions;

  createFieldExtension(proxyToReviewExtension);
  createFieldExtension(proxyToWorkExtension);
  createFieldExtension(linkReviewedWorksExtension);

  const typeDefs = [
    schema.buildEnumType(MarkdownNodeKindEnum),
    schema.buildEnumType(WorkKindEnum),
    schema.buildObjectType(TimelineEntry),
    schema.buildObjectType(WorkAuthor),
    schema.buildObjectType(MarkdownRemark),
    schema.buildObjectType(WorksJson),
    schema.buildObjectType(AuthorsJson),
    schema.buildObjectType(ReadingWithReview),
    schema.buildObjectType(ReadingsJson),
    schema.buildObjectType(MostReadAuthor),
  ];

  createTypes(typeDefs);
}
