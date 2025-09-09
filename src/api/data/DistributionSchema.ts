import { z } from "zod";

/**
 * Zod schema for distribution data used in statistics.
 * Represents a named category with an associated count value.
 */
export const DistributionSchema = z.object({
  count: z.number(),
  name: z.string(),
});
