import { z } from "zod";

export function nullableString() {
  return z.nullable(z.string()).transform((data) => data ?? undefined);
}
