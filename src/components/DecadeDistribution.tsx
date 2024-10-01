import { Distribution } from "./Distribution";

export function DecadeDistribution({
  values,
}: {
  values: React.ComponentProps<typeof Distribution>["values"];
}): JSX.Element {
  return <Distribution values={values} title="By Year Published" />;
}
