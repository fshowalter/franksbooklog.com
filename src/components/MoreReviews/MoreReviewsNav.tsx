import type { IBoxProps } from "../Box";
import { Box } from "../Box";
import { maxWidthStyle } from "./MoreReviewsNav.css";

export function MoreReviewsNav({ children }: IBoxProps) {
  return (
    <Box
      as="nav"
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="center"
      width={{ default: "full", desktop: "unset" }}
      className={maxWidthStyle}
      paddingX={{ default: 0, tablet: "gutter", desktop: 0 }}
    >
      {children}
    </Box>
  );
}
