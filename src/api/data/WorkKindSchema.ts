import { z } from "zod";

/**
 * Zod schema defining the valid kinds of literary works.
 * Used for validation and type safety across the application.
 */
export const WorkKindSchema = z.enum([
  "Anthology",
  "Collection",
  "Nonfiction",
  "Novel",
  "Novella",
  "Short Story",
]);
