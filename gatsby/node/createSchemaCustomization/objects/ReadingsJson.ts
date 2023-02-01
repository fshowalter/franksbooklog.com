import toHtml from "hast-util-to-html";
import toHast from "mdast-util-to-hast";
import remark from "remark";
import type { Node } from "unist";
import { SchemaNames } from "../schemaNames";
import type {
  GatsbyNode,
  GatsbyNodeContext,
  GatsbyResolveArgs,
  GatsbyResolveInfo,
} from "../type-definitions";
import { resolveFieldForNode } from "../utils/resolveFieldForNode";
import { MarkdownRemarkNode } from "./MarkdownRemark";

export interface ReadingNode extends GatsbyNode {
  workSlug: string;
  sequence: number;
  editionNotes: string;
  timeline: {
    date: string;
    progress: number | "Finished" | "Abandoned";
  }[];
}

interface IHastNode extends Node {
  children: {
    tagName: string;
  }[];
}

export const ReadingsJson = {
  name: SchemaNames.ReadingsJson,
  interfaces: ["Node"],
  fields: {
    sequence: "Int!",
    workSlug: "String!",
    edition: "String!",
    timeline: {
      type: `[${SchemaNames.TimelineEntry}!]!`,
    },
    isAudiobook: {
      type: "Boolean!",
      resolve: (source: ReadingNode) => {
        return source.edition === "Audible";
      },
    },
    readingTime: {
      type: "Int!",
      extensions: {
        dateformat: {},
      },
      resolve: (source: ReadingNode) => {
        const start = new Date(`${source.timeline[0].date}T00:00:00`);
        const end = new Date(
          `${source.timeline[source.timeline.length - 1].date}T00:00:00`
        );

        if (start === end) {
          return 1;
        }

        return Math.round(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );
      },
    },
    editionNotes: {
      type: "String",
      resolve: (source: ReadingNode) => {
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
    readingNote: {
      type: SchemaNames.MarkdownRemark,
      resolve: async (
        source: ReadingNode,
        _args: unknown,
        context: GatsbyNodeContext
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
    work: {
      type: `${SchemaNames.WorksJson}!`,
      resolve: async (
        source: ReadingNode,
        _args: unknown,
        context: GatsbyNodeContext
      ) => {
        return await context.nodeModel.findOne({
          type: SchemaNames.WorksJson,
          query: {
            filter: {
              slug: { eq: source.workSlug },
            },
          },
        });
      },
    },
    abandoned: {
      type: "Boolean!",
      resolve: (source: ReadingNode) => {
        return (
          source.timeline[source.timeline.length - 1].progress == "Abandoned"
        );
      },
    },
    date: {
      type: "Date!",
      extensions: {
        dateformat: {},
      },
      resolve: (source: ReadingNode) => {
        return source.timeline.reduce((prev, current) =>
          prev.date > current.date ? prev : current
        ).date;
      },
    },
    excerpt: {
      type: "String",
      resolve: async (
        source: ReadingNode,
        args: GatsbyResolveArgs,
        context: GatsbyNodeContext,
        info: GatsbyResolveInfo
      ) => {
        const { totalCount } = await context.nodeModel.findAll<ReadingNode>({
          type: SchemaNames.ReadingsJson,
          query: {
            filter: {
              workSlug: {
                eq: source.workSlug,
              },
            },
          },
        });

        if ((await totalCount()) > 1) {
          const readingNoteNode = await resolveFieldForNode<MarkdownRemarkNode>(
            "readingNote",
            source,
            context,
            info,
            args
          );

          if (readingNoteNode) {
            return resolveFieldForNode<string>(
              "html",
              readingNoteNode,
              context,
              info,
              args
            );
          }
        }

        const reviewNode = await resolveFieldForNode<MarkdownRemarkNode>(
          "review",
          source,
          context,
          info,
          args
        );

        if (!reviewNode) {
          return null;
        }

        return await resolveFieldForNode<string>(
          "excerptHtml",
          reviewNode,
          context,
          info,
          args
        );
      },
    },
    title: {
      type: "String!",
      extensions: {
        proxyToWork: {
          fieldName: "title",
        },
      },
    },
    sortTitle: {
      type: "String!",
      extensions: {
        proxyToWork: {
          fieldName: "sortTitle",
        },
      },
    },
    yearPublished: {
      type: "Int!",
      extensions: {
        proxyToWork: {
          fieldName: "yearPublished",
        },
      },
    },
    kind: {
      type: "String!",
      extensions: {
        proxyToWork: {
          fieldName: "kind",
        },
      },
    },
    authors: {
      type: `[${SchemaNames.WorkAuthor}!]!`,
      extensions: {
        proxyToWork: {
          fieldName: "authors",
        },
      },
    },
    cover: {
      type: "File!",
      extensions: {
        proxyToWork: {
          fieldName: "cover",
        },
      },
    },
    year: {
      type: "Int!",
      resolve: (source: ReadingNode) => {
        const lastDate = source.timeline.reduce((prev, current) =>
          prev.date > current.date ? prev : current
        );

        return parseInt(lastDate.date.substring(0, 4));
      },
    },
    grade: {
      type: "String",
      extensions: {
        proxyToReview: {
          fieldName: "grade",
        },
      },
    },
    review: {
      type: SchemaNames.MarkdownRemark,
      extensions: {
        proxyToWork: {
          fieldName: "review",
        },
      },
    },
    gradeValue: {
      type: "Int",
      extensions: {
        proxyToReview: {
          fieldName: "gradeValue",
        },
      },
    },
  },
  extensions: {
    infer: false,
  },
};
