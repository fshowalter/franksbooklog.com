import type { AlltimeStats } from "~/api/stats";

import { Distribution } from "./Distribution";

/**
 * Displays a distribution chart for review grades.
 * @param props - Component props
 * @param props.values - Array of grade distribution data with count and name
 * @returns Grade distribution component
 */
export function GradeDistribution({
  values,
}: {
  values: Pick<AlltimeStats["gradeDistribution"][0], "count" | "name">[];
}): React.JSX.Element {
  return <Distribution title="Grade Distribution" values={values} />;
}
