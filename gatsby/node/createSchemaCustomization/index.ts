import type { CreateSchemaCustomizationArgs } from "gatsby";
import { linkReviewedWorksExtension } from "./extensions/linkReviewedWorks";
import { proxyToReviewExtension } from "./extensions/proxyToReview";
import { AuthorsJson, AuthorWork } from "./objects/AuthorsJson";
import { MarkdownRemark } from "./objects/MarkdownRemark";
import { ReadingProgressAuthor } from "./objects/ReadingProgressAuthor";
import { ReadingProgressJson } from "./objects/ReadingProgressJson";
import {
  ReviewedWorkReading,
  ReviewedWorkReadingTimelineEntry,
  ReviewedWorksJson,
} from "./objects/ReviewedWorksJson";
import { TimelineEntry } from "./objects/TimelineEntry";
import { UnreviewedWorksJson } from "./objects/UnreviewedWorksJson";
import { WorkAuthor } from "./objects/WorkAuthor";

export function createSchemaCustomization({
  actions,
  schema,
}: CreateSchemaCustomizationArgs) {
  const { createTypes, createFieldExtension } = actions;

  createFieldExtension(proxyToReviewExtension);
  createFieldExtension(linkReviewedWorksExtension);

  const typeDefs = [
    schema.buildObjectType(TimelineEntry),
    schema.buildObjectType(WorkAuthor),
    schema.buildObjectType(MarkdownRemark),
    schema.buildObjectType(AuthorWork),
    schema.buildObjectType(AuthorsJson),
    schema.buildObjectType(ReviewedWorkReading),
    schema.buildObjectType(ReviewedWorkReadingTimelineEntry),
    schema.buildObjectType(ReviewedWorksJson),
    schema.buildObjectType(UnreviewedWorksJson),
    schema.buildObjectType(ReadingProgressAuthor),
    schema.buildObjectType(ReadingProgressJson),
  ];

  createTypes(typeDefs);
}
