import { foregroundColors } from "../../styles/colors.css";
import { Box } from "../Box";
import { Link } from "../Link";
import { PageTitle } from "../PageTitle";
import { Spacer } from "../Spacer";

export function Header({
  reviewCount,
  shortStoryCount,
  bookCount,
  abandonedCount,
}: {
  reviewCount: number;
  shortStoryCount: number;
  bookCount: number;
  abandonedCount: number;
}): JSX.Element {
  return (
    <>
      <PageTitle textAlign="center">Reviews</PageTitle>
      <Spacer axis="vertical" size={8} />
      <Box as="q" display="block" textAlign="center" color="subtle">
        I intend to put up with nothing that I can put down.
      </Box>
      <Spacer axis="vertical" size={16} />

      <Box color="subtle">
        <Spacer axis="vertical" size={16} />
        <Box as="p" textAlign="center">
          Since 2022, I&apos;ve published{" "}
          <Box as="span" color="emphasis">
            {reviewCount.toLocaleString()}
          </Box>{" "}
          reviews comprising{" "}
          <Box as="span" color="emphasis">
            {shortStoryCount.toLocaleString()}
          </Box>{" "}
          short stories and{" "}
          <Box as="span" color="emphasis">
            {bookCount.toLocaleString()}
          </Box>{" "}
          books (
          <Box as="span" color="emphasis">
            {abandonedCount.toLocaleString()}
          </Box>{" "}
          abandoned).
        </Box>
        <Spacer axis="vertical" size={16} />
        <Box as="p" textAlign="center">
          More <Link to="/stats/">reading stats</Link>.
        </Box>
        <Spacer axis="vertical" size={32} />
        <Box display="flex" justifyContent="center">
          <Link
            to="/reviews/authors"
            display="flex"
            columnGap={16}
            boxShadow="borderAll"
            paddingX={16}
            paddingY={8}
            borderRadius={8}
            alignItems="center"
            justifyContent="center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={foregroundColors.default}
              width={20}
              height={20}
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Browse Authors
          </Link>
        </Box>
      </Box>
    </>
  );
}
