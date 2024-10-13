import type { AlltimeStats } from "~/api/alltimeStats";

import { Distribution } from "~/components/Distribution";

export function GradeDistribution({
  values,
}: {
  values: Pick<AlltimeStats["gradeDistribution"][0], "count" | "name">[];
}) {
  return <Distribution title="Grade Distribution" values={values} />;
}
