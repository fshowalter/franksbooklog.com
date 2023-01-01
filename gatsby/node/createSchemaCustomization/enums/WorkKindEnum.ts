import { SchemaNames } from "../schemaNames";

export const WorkKindEnum = {
  name: SchemaNames.WorkKind,
  values: {
    SHORTSTORY: { value: `Short Story` },
    COLLECTION: { value: `Collection` },
    NOVEL: { value: `Novel` },
    NOVELLA: { value: `Novella` },
    NONFICTION: { value: `Nonfiction` },
    ANTHOLOGY: { value: `Anthology` },
  },
};
