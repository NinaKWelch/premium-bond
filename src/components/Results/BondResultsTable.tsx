'use client';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { TResults } from '#types/bonds';

interface IBondResultsTableProps {
  results: TResults;
}

const formatAmount = (value: number) =>
  value < 0 ? `-£${Math.abs(value).toFixed(2)}` : `£${value.toFixed(2)}`;

const BondResultsTable = ({ results }: IBondResultsTableProps) => {
  const { byYear, overall } = results;

  return (
    <Table
      size="small"
      aria-label="Year-by-year bond results"
      sx={{
        '& .MuiTableCell-root': { fontSize: { xs: '0.8rem', sm: '1.125rem' } },
        '& .MuiTableHead-root .MuiTableCell-root': { lineHeight: { xs: 1.2, sm: 'inherit' } },
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell>Year</TableCell>
          <TableCell sx={{ textAlign: { xs: 'center', sm: 'right' } }}>Amount invested</TableCell>
          <TableCell sx={{ textAlign: { xs: 'center', sm: 'right' } }}>Prizes won</TableCell>
          <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, textAlign: 'right' }}>
            Avg balance
          </TableCell>
          <TableCell sx={{ textAlign: { xs: 'center', sm: 'right' } }}>Effective rate</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {byYear.map((row) => (
          <TableRow key={row.year}>
            <TableCell>{row.year}</TableCell>
            <TableCell
              align="right"
              sx={{ color: row.amountInvested < 0 ? 'error.main' : 'inherit' }}
            >
              {formatAmount(row.amountInvested)}
            </TableCell>
            <TableCell align="right">£{row.prizesWon.toFixed(2)}</TableCell>
            <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
              £{row.averageBalance.toFixed(2)}
            </TableCell>
            <TableCell align="right">{row.effectiveRatePct.toFixed(2)}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 'inherit' }}>
              Total
            </Typography>
          </TableCell>
          <TableCell
            align="right"
            sx={{ color: overall.totalInvested < 0 ? 'error.main' : 'inherit' }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 'inherit' }}>
              {formatAmount(overall.totalInvested)}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 'inherit' }}>
              £{overall.totalPrizesWon.toFixed(2)}
            </Typography>
          </TableCell>
          <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} />
          <TableCell align="right">
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 'inherit' }}>
              {overall.averageAnnualRatePct.toFixed(2)}%
            </Typography>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default BondResultsTable;
