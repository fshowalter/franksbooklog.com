import type { JSX } from "react";

import { Distribution } from "./Distribution";

export function KindDistribution({
  values,
}: {
  values: React.ComponentProps<typeof Distribution>["values"];
}): JSX.Element {
  return <Distribution title="By Kind" values={values} />;
}
