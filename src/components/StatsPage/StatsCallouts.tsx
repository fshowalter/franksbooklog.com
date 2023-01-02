import { Box } from "../Box";

function Callout({
  stat,
  label,
}: {
  stat: number;
  label: string;
}): JSX.Element {
  return (
    <Box
      boxShadow="borderAll"
      borderRadius="half"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      height={144}
      width={144}
      textAlign="center"
    >
      <Box fontSize="xLarge">{stat.toLocaleString()}</Box>{" "}
      <Box color="subtle">{label}</Box>
    </Box>
  );
}

export function StatsCallouts({
  readingCount,
  bookCount,
  reviewCount,
  fromShelfCount,
}: {
  readingCount: number;
  bookCount: number;
  reviewCount: number;
  fromShelfCount: number;
}): JSX.Element {
  return (
    <Box
      display="flex"
      columnGap={24}
      rowGap={24}
      justifyContent="center"
      flexWrap={{ default: "wrap", desktop: "nowrap" }}
    >
      <Callout label="Titles" stat={readingCount} />
      <Callout label="Books" stat={bookCount} />
      <Callout label="Reviews" stat={reviewCount} />
      <Callout label="From Shelf" stat={fromShelfCount} />
    </Box>
  );
}
