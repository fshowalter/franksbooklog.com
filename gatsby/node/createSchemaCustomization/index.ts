import type { CreateSchemaCustomizationArgs } from "gatsby";
import { linkReviewedWorksExtension } from "./extensions/linkReviewedWorks";
import {
  AuthorsJson,
  AuthorsJsonWork,
  AuthorsJsonWorkAuthor,
} from "./objects/AuthorsJson";
import { MarkdownRemark } from "./objects/MarkdownRemark";
import {
  ReadingStatsJson,
  ReadingStatsJsonDistribution,
  ReadingStatsJsonMostReadAuthor,
  ReadingStatsJsonMostReadAuthorReading,
} from "./objects/ReadingStatsJson";
import {
  ReviewedWorksJson,
  ReviewedWorksJsonIncludedWork,
  ReviewedWorksJsonIncludedWorkAuthor,
  ReviewedWorksJsonMoreByAuthor,
  ReviewedWorksJsonMoreWork,
  ReviewedWorksJsonMoreWorkAuthor,
  ReviewedWorksJsonReading,
  ReviewedWorksJsonReadingTimelineEntry,
  ReviewedWorksJsonWorkAuthor,
} from "./objects/ReviewedWorksJson";
import {
  TimelineEntriesJson,
  TimelineEntriesJsonAuthor,
} from "./objects/TimelineEntriesJson";
import {
  UnreviewedWorksJson,
  UnreviewedWorksJsonWorkAuthor,
} from "./objects/UnreviewedWorksJson";

export function createSchemaCustomization({
  actions,
  schema,
}: CreateSchemaCustomizationArgs) {
  const { createTypes, createFieldExtension } = actions;

  createFieldExtension(linkReviewedWorksExtension);

  const typeDefs = [
    schema.buildObjectType(MarkdownRemark),
    schema.buildObjectType(AuthorsJsonWorkAuthor),
    schema.buildObjectType(AuthorsJsonWork),
    schema.buildObjectType(AuthorsJson),
    schema.buildObjectType(ReviewedWorksJsonWorkAuthor),
    schema.buildObjectType(ReviewedWorksJsonIncludedWorkAuthor),
    schema.buildObjectType(ReviewedWorksJsonIncludedWork),
    schema.buildObjectType(ReviewedWorksJsonReading),
    schema.buildObjectType(ReviewedWorksJsonReadingTimelineEntry),
    schema.buildObjectType(ReviewedWorksJsonMoreWorkAuthor),
    schema.buildObjectType(ReviewedWorksJsonMoreWork),
    schema.buildObjectType(ReviewedWorksJsonMoreByAuthor),
    schema.buildObjectType(ReviewedWorksJson),
    schema.buildObjectType(UnreviewedWorksJsonWorkAuthor),
    schema.buildObjectType(UnreviewedWorksJson),
    schema.buildObjectType(TimelineEntriesJsonAuthor),
    schema.buildObjectType(TimelineEntriesJson),
    schema.buildObjectType(ReadingStatsJsonMostReadAuthorReading),
    schema.buildObjectType(ReadingStatsJsonMostReadAuthor),
    schema.buildObjectType(ReadingStatsJsonDistribution),
    schema.buildObjectType(ReadingStatsJson),
  ];

  createTypes(typeDefs);
}
