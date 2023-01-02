import { Box } from "../Box";
import { Link } from "../Link";
import { activeLinkStyle } from "./StatsNavigation.css";

function ListItem({
  text,
  target,
}: {
  text: string;
  target: string;
}): JSX.Element {
  return (
    <Box as="li" display="block">
      <Link to={target} activeClassName={activeLinkStyle}>
        {text}
      </Link>
    </Box>
  );
}

export function StatsNavigation({
  years,
}: {
  years: readonly string[];
}): JSX.Element {
  return (
    <Box
      as="ul"
      display="flex"
      fontSize="medium"
      columnGap={16}
      rowGap={16}
      flexWrap="wrap"
      justifyContent="center"
    >
      <ListItem text="All-Time" target="/stats/" />
      {[...years].reverse().map((year) => {
        return <ListItem key={year} text={year} target={`/stats/${year}`} />;
      })}
    </Box>
  );
}
