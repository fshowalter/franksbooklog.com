import { z } from "zod";

export const DistributionSchema = z.object({
  count: z.number(),
  name: z.string(),
});
