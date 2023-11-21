import { SchemaNames } from "../schemaNames";
import type { GatsbyNode } from "../type-definitions";
import {
  GatsbyNodeContext,
  GatsbyResolveArgs,
  GatsbyResolveInfo,
} from "../type-definitions";
import { resolveFieldForNode } from "../utils/resolveFieldForNode";
import { MarkdownRemarkNode } from "./MarkdownRemark";
import { coverResolver } from "./fieldResolvers/coverResolver";

interface ReviewedWorkNode extends GatsbyNode {
  slug: string;
  sequence: number;
  includedInSlugs: string[];
}

export const ReviewedWorkReadingTimelineEntry = {
  name: SchemaNames.ReviewedWorkReadingTimelineEntry,
  fields: {
    date: {
      type: "Date!",
      extensions: {
        dateformat: {},
      },
    },
    progress: "String!",
  },
};

export const ReviewedWorkReading = {
  name: SchemaNames.ReviewedWorkReading,
  fields: {
    sequence: "Int!",
    date: {
      type: "Date!",
      extensions: {
        dateformat: {},
      },
    },
    edition: "String!",
    editionNotes: "String",
    isAudioBook: "Boolean!",
    abandoned: "Boolean!",
    timeline: `[${SchemaNames.ReviewedWorkReadingTimelineEntry}!]!`,
    readingTime: "Int",
    readingNote: {
      type: SchemaNames.MarkdownRemark,
      resolve: async (
        source: {
          sequence: number;
        },
        _args: unknown,
        context: GatsbyNodeContext,
      ) => {
        return await context.nodeModel.findOne({
          type: SchemaNames.MarkdownRemark,
          query: {
            filter: {
              fileAbsolutePath: {
                regex: `//reading_notes/${source.sequence
                  .toString()
                  .padStart(4, "0")}-.*/`,
              },
            },
          },
        });
      },
    },
  },
};

export const ReviewedWorksJson = {
  name: SchemaNames.ReviewedWorksJson,
  interfaces: ["Node"],
  fields: {
    sequence: "Int!",
    title: "String!",
    subtitle: "String",
    sortTitle: "String!",
    slug: "String!",
    includedInSlugs: "[String!]!",
    edition: "String!",
    date: {
      type: "Date!",
      extensions: {
        dateformat: {},
      },
    },
    excerpt: {
      type: "String",
      resolve: excerptResolver,
    },
    yearPublished: "Int!",
    yearReviewed: `Int!`,
    kind: "String!",
    authors: `[${SchemaNames.WorkAuthor}!]!`,
    cover: {
      type: "File!",
      resolve: coverResolver,
    },
    grade: "String",
    gradeValue: `Int!`,
    readings: `[${SchemaNames.ReviewedWorkReading}!]!`,
  },
  extensions: {
    infer: false,
  },
};

async function excerptResolver(
  source: ReviewedWorkNode,
  args: GatsbyResolveArgs,
  context: GatsbyNodeContext,
  info: GatsbyResolveInfo,
) {
  const reviewFileNode = await context.nodeModel.findOne<GatsbyNode>({
    type: "File",
    query: {
      filter: {
        sourceInstanceName: {
          eq: "reviews",
        },
        childMarkdownRemark: {
          frontmatter: {
            work_slug: {
              eq: source.slug,
            },
          },
        },
      },
    },
  });

  if (!reviewFileNode) {
    return null;
  }

  const reviewMarkdownNode = await resolveFieldForNode<MarkdownRemarkNode>({
    fieldName: "childMarkdownRemark",
    source: reviewFileNode,
    context,
    info,
  });

  return await resolveFieldForNode<string>({
    fieldName: "excerptHtml",
    source: reviewMarkdownNode,
    context,
    info,
    args,
  });
}
