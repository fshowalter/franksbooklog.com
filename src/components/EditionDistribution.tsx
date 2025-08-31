import { Distribution } from "./Distribution";

export function EditionDistribution({
  values,
}: {
  values: React.ComponentProps<typeof Distribution>["values"];
}): JSX.Element {
  return <Distribution title="By Edition" values={values} />;
}
