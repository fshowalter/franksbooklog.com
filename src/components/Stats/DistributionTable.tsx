import { BarGradient } from "../BarGradient";
import { StatHeading } from "./StatHeading";
import {
  Table,
  TableDataCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "./Table";

export function DistributionTable({
  title,
  nameColumnLabel,
  countColumnLabel,
  distributions,
}: {
  title: string;
  nameColumnLabel: string;
  countColumnLabel: string;
  distributions?: readonly IDistribution[] | null;
}): JSX.Element | null {
  if (!distributions) {
    return null;
  }

  const maxBar = distributions.reduce((acc, stat) => {
    const value = stat.count;
    return acc > value ? acc : value;
  }, 0);

  return (
    <section>
      <StatHeading>{title}</StatHeading>
      <Table>
        <TableHead>
          <tr>
            <TableHeaderCell align="left">{nameColumnLabel}</TableHeaderCell>
            <th>&nbsp;</th>
            <TableHeaderCell align="right">{countColumnLabel}</TableHeaderCell>
          </tr>
        </TableHead>
        <tbody>
          {distributions.map((distribution) => {
            return (
              <TableRow key={distribution.name}>
                <TableDataCell align="left">{distribution.name}</TableDataCell>
                <TableDataCell align="fill">
                  <BarGradient value={distribution.count} maxValue={maxBar} />
                </TableDataCell>
                <TableDataCell align="right">
                  {distribution.count}
                </TableDataCell>
              </TableRow>
            );
          })}
        </tbody>
      </Table>
    </section>
  );
}

export interface IDistribution {
  name: string | null;
  count: number;
}
