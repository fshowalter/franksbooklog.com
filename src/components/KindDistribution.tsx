import { Distribution } from "./Distribution";

export function KindDistribution({
  values,
}: {
  values: React.ComponentProps<typeof Distribution>["values"];
}): JSX.Element {
  return <Distribution values={values} title="By Kind" />;
}
