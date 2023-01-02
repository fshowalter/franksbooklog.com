import { graphql } from "gatsby";
import { Box, IBoxProps } from "../Box";
import { Spacer } from "../Spacer";
import { ReadingHistoryEntry } from "./ReadingHistoryEntry";

interface IIReadingHistoryProps extends IBoxProps {
  work: Queries.ReadingHistoryFragment;
}
export function ReadingHistory({ work, ...rest }: IIReadingHistoryProps) {
  return (
    <Box {...rest}>
      <Box
        as="h3"
        color="subtle"
        fontSize="medium"
        fontWeight="normal"
        paddingX="gutter"
        boxShadow="borderBottom"
        {...rest}
      >
        Reading History
        <Spacer size={8} axis="vertical" />
      </Box>
      <Box as="ul">
        {work.readings.map((reading) => (
          <ReadingHistoryEntry
            as="li"
            key={reading.sequence}
            reading={reading}
          />
        ))}
      </Box>
    </Box>
  );
}

export const query = graphql`
  fragment ReadingHistory on ReviewedWork {
    readings {
      ...ReadingHistoryEntry
    }
  }
`;
