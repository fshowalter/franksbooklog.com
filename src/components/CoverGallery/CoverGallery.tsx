import { composeClassNames } from "../../styles/composeClassNames";
import { Box, IBoxProps } from "../Box";
import { gridStyle } from "./CoverGallery.css";

export function CoverGallery({
  children,
  className,
  ...rest
}: IBoxProps): JSX.Element {
  return (
    <Box
      as="ol"
      className={composeClassNames(gridStyle, className)}
      paddingX={0}
      {...rest}
    >
      {children}
    </Box>
  );
}
