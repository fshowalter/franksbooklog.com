import { SchemaNames } from "../schemaNames";

export interface TimelineEntryNode {
  date: string;
  progress: string;
}

export const TimelineEntry = {
  name: SchemaNames.TimelineEntry,
  fields: {
    date: {
      type: "String!",
      extensions: {
        dateformat: {},
      },
    },
    progress: "String!",
  },
};
