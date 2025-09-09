import { z } from "zod";

/**
 * Creates a Zod schema for nullable strings that transforms null values to undefined.
 * This is useful for handling JSON data where null values should be treated as undefined
 * in TypeScript for better type consistency.
 * 
 * @returns A Zod schema that accepts string | null and transforms null to undefined
 * 
 * @example
 * ```typescript
 * const schema = z.object({
 *   optionalField: nullableString()
 * });
 * 
 * // Input: { optionalField: null } -> Output: { optionalField: undefined }
 * // Input: { optionalField: "value" } -> Output: { optionalField: "value" }
 * ```
 */
export function nullableString() {
  return z.nullable(z.string()).transform((data) => data ?? undefined);
}
