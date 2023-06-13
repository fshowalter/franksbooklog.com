import { Box } from "../Box";
import { PageTitle } from "../PageTitle";
import { Spacer } from "../Spacer";

export function Header({ shelfCount }: { shelfCount: number }): JSX.Element {
  return (
    <>
      <PageTitle textAlign="center">The Shelf</PageTitle>
      <Box as="q" display="block" textAlign="center" color="subtle">
        Classic: A book which people praise and don’t read.
      </Box>
      <Spacer axis="vertical" size={16} />

      <Box color="subtle" textAlign="center">
        <Spacer axis="vertical" size={16} />
        <p>
          My to-read list.{" "}
          <Box as="span" color="emphasis">
            {shelfCount.toLocaleString()}
          </Box>{" "}
          titles.
        </p>
      </Box>
    </>
  );
}
