import { Distribution } from "./Distribution";

export function DecadeDistribution({
  values,
}: {
  values: React.ComponentProps<typeof Distribution>["values"];
}): React.JSX.Element {
  return <Distribution title="By Year Published" values={values} />;
}
