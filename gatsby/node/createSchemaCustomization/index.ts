import type { CreateSchemaCustomizationArgs } from "gatsby";
import { linkReviewedWorksExtension } from "./extensions/linkReviewedWorks";
import { proxyToReviewExtension } from "./extensions/proxyToReview";
import { proxyToWorkExtension } from "./extensions/proxyToWork";
import { AuthorsJson } from "./objects/AuthorsJson";
import { MarkdownRemark } from "./objects/MarkdownRemark";
import { MostReadAuthor } from "./objects/MostReadAuthor";
import { ProgressJson } from "./objects/ProgressJson";
import { ReadingWithReview } from "./objects/ReadingWithReview";
import { ReadingsJson } from "./objects/ReadingsJson";
import { ReviewedWorkAuthor } from "./objects/ReviewedWorkAuthor";
import { ReviewedWorksJson } from "./objects/ReviewedWorksJson";
import { ReviewsJson } from "./objects/ReviewsJson";
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
    schema.buildObjectType(TimelineEntry),
    schema.buildObjectType(WorkAuthor),
    schema.buildObjectType(MarkdownRemark),
    schema.buildObjectType(WorksJson),
    schema.buildObjectType(AuthorsJson),
    schema.buildObjectType(ReadingWithReview),
    schema.buildObjectType(ReadingsJson),
    schema.buildObjectType(MostReadAuthor),
    schema.buildObjectType(ReviewedWorksJson),
    schema.buildObjectType(ProgressJson),
    schema.buildObjectType(ReviewedWorkAuthor),
    schema.buildObjectType(ReviewsJson),
  ];

  createTypes(typeDefs);
}
