import { Box } from "../Box";
import { Link } from "../Link";
import { PageTitle } from "../PageTitle";
import { Spacer } from "../Spacer";

export function Header() {
  return (
    <Box maxWidth="prose">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Link to="/reviews/">Reviews</Link>
        <Spacer axis="vertical" size={4} />
        <PageTitle textAlign="center">Authors</PageTitle>
        <Spacer axis="vertical" size={8} />
        <Box color="subtle">
          <Box as="q" display="block" textAlign="center" color="subtle">
            There is nothing to writing. All you do is sit down at a typewriter
            and bleed.
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
