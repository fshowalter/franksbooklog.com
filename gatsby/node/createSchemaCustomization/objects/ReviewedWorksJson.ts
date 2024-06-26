import { Node } from "hast";
import toHtml from "hast-util-to-html";
import toHast from "mdast-util-to-hast";
import remark from "remark";
import { SchemaNames } from "../schemaNames";
import type { GatsbyNode } from "../type-definitions";
import { GatsbyNodeContext } from "../type-definitions";
import { coverResolver } from "./utils/coverResolver";

export interface ReviewedWorksJsonNode extends GatsbyNode {
  slug: string;
  sequence: number;
  includedInSlugs: string[];
}

interface ReviewedWorksJsonReadingNode {
  editionNotes: string;
}

interface IHastNode extends Node {
  children: {
    tagName: string;
  }[];
}

export const ReviewedWorksJsonWorkAuthor = {
  name: SchemaNames.ReviewedWorksJsonWorkAuthor,
  fields: {
    slug: "String!",
    notes: "String",
    name: "String!",
    sortName: "String!",
  },
};

export const ReviewedWorksJsonReadingTimelineEntry = {
  name: SchemaNames.ReviewedWorksJsonReadingTimelineEntry,
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

export const ReviewedWorksJsonMoreWorkAuthor = {
  name: SchemaNames.ReviewedWorksJsonMoreWorkAuthor,
  fields: {
    name: "String!",
  },
};

export const ReviewedWorksJsonMoreWork = {
  name: SchemaNames.ReviewedWorksJsonMoreWork,
  fields: {
    title: "String!",
    kind: "String!",
    yearPublished: "String!",
    slug: "String!",
    grade: "String",
    authors: `[${SchemaNames.ReviewedWorksJsonMoreWorkAuthor}!]!`,
    includedInSlugs: "[String!]!",
    cover: {
      type: "File!",
      resolve: coverResolver,
    },
  },
};

export const ReviewedWorksJsonMoreByAuthor = {
  name: SchemaNames.ReviewedWorksJsonMoreByAuthor,
  fields: {
    name: "String!",
    slug: "String!",
    works: `[${SchemaNames.ReviewedWorksJsonMoreWork}!]!`,
  },
};

export const ReviewedWorksJsonIncludedWorkAuthor = {
  name: SchemaNames.ReviewedWorksJsonIncludedWorkAuthor,
  fields: {
    name: "String!",
    slug: "String!",
  },
};

export const ReviewedWorksJsonIncludedWork = {
  name: SchemaNames.ReviewedWorksJsonIncludedWork,
  fields: {
    title: "String!",
    authors: `[${SchemaNames.ReviewedWorksJsonIncludedWorkAuthor}!]!`,
    grade: "String!",
    slug: "String!",
    cover: {
      type: "File!",
      resolve: coverResolver,
    },
  },
};

export const ReviewedWorksJsonReading = {
  name: SchemaNames.ReviewedWorksJsonReading,
  fields: {
    sequence: "Int!",
    date: {
      type: "Date!",
      extensions: {
        dateformat: {},
      },
    },
    edition: "String!",
    editionNotes: {
      type: "String",
      resolve: (source: ReviewedWorksJsonReadingNode) => {
        if (!source.editionNotes) {
          return null;
        }

        const mdast = remark().parse(source.editionNotes);

        const hast = toHast(mdast, {
          allowDangerousHtml: true,
        }) as IHastNode;

        hast.children[0].tagName = "span";

        return toHtml(hast, {
          allowDangerousHtml: true,
        });
      },
      extensions: {
        linkReviewedWorks: {},
      },
    },
    isAudiobook: "Boolean!",
    abandoned: "Boolean!",
    timeline: `[${SchemaNames.ReviewedWorksJsonReadingTimelineEntry}!]!`,
    readingTime: "Int",
    readingNotes: {
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
                regex: `//readings/${source.sequence
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
    yearPublished: "String!",
    yearReviewed: `String!`,
    kind: "String!",
    authors: `[${SchemaNames.ReviewedWorksJsonWorkAuthor}!]!`,
    cover: {
      type: "File!",
      resolve: coverResolver,
    },
    grade: "String!",
    gradeValue: `Int!`,
    readings: `[${SchemaNames.ReviewedWorksJsonReading}!]!`,
    moreByAuthors: `[${SchemaNames.ReviewedWorksJsonMoreByAuthor}!]!`,
    moreReviews: `[${SchemaNames.ReviewedWorksJsonMoreWork}!]!`,
    includedWorks: `[${SchemaNames.ReviewedWorksJsonIncludedWork}!]!`,
    review: {
      type: `${SchemaNames.MarkdownRemark}!`,
      resolve: async (
        source: ReviewedWorksJsonNode,
        _args: unknown,
        context: GatsbyNodeContext,
      ) => {
        return await context.nodeModel.findOne({
          type: SchemaNames.MarkdownRemark,
          query: {
            filter: {
              frontmatter: {
                work_slug: {
                  eq: source.slug,
                },
              },
            },
          },
        });
      },
    },
  },
  extensions: {
    infer: false,
  },
};
