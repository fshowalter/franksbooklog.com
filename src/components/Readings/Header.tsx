import { Box } from "../Box";
import { PageTitle } from "../PageTitle";
import { Spacer } from "../Spacer";

export function Header({ workCount }: { workCount: number }): JSX.Element {
  return (
    <>
      <PageTitle textAlign="center">Reading Log</PageTitle>
      <Spacer axis="vertical" size={8} />
      <Box as="q" display="block" textAlign="center" color="subtle">
        It is what you read when you don&apos;t have to that determines what you
        will be when you can&apos;t help it.
      </Box>
      <Spacer axis="vertical" size={16} />

      <Box color="subtle" textAlign="center">
        <Spacer axis="vertical" size={16} />
        <p>
          Since 2022, I&apos;ve read{" "}
          <Box as="span" color="emphasis">
            {workCount.toLocaleString()}
          </Box>{" "}
          works.
        </p>
      </Box>
    </>
  );
}
