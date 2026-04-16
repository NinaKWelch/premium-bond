import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { InfoOutlined as InfoOutlinedIcon } from '@mui/icons-material'
import type { TResults } from '../../types/bonds'

interface IBondResultsTableProps {
  results: TResults
}

const appendixText = {
  avgBalance:
    'The average amount invested throughout the year. Money deposited mid-year only counts for the portion of the year it was actually held.',
  effectiveRate:
    'The percentage return earned that year, calculated as prizes won divided by the average balance. This is what a savings account would need to pay to match the prize winnings.',
}

const BondResultsTable = ({ results }: IBondResultsTableProps) => {
  const { byYear, overall } = results

  return (
    <Stack spacing={2}>
      {/* Print-only column explanations (appendix style) */}
      <Stack spacing={0.5} className="print-title" sx={{ display: 'none' }}>
        <Typography variant="body2" sx={{ fontSize: '0.75rem' }} color="text.secondary">
          <strong>Avg balance:</strong> {appendixText.avgBalance}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem' }} color="text.secondary">
          <strong>Effective rate:</strong> {appendixText.effectiveRate}
        </Typography>
      </Stack>

      <Table
        size="small"
        aria-label="Year-by-year bond results"
        sx={{
          '& .MuiTableCell-root': { fontSize: { xs: '0.8rem', sm: 'inherit' } },
          '& .MuiTableHead-root .MuiTableCell-root': { lineHeight: { xs: 1.2, sm: 'inherit' } },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Year</TableCell>
            <TableCell sx={{ textAlign: { xs: 'center', sm: 'right' } }}>Amount invested</TableCell>
            <TableCell sx={{ textAlign: { xs: 'center', sm: 'right' } }}>Prizes won</TableCell>
            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, textAlign: 'right' }}>
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ justifyContent: 'flex-end', alignItems: 'center' }}
              >
                Avg balance
                <Tooltip title={appendixText.avgBalance}>
                  <InfoOutlinedIcon
                    sx={{
                      cursor: 'help',
                      fontSize: { sm: '1.1rem', md: '1.25rem' },
                      color: 'primary.main',
                      ml: 0.75,
                    }}
                    className="print-hide"
                  />
                </Tooltip>
              </Stack>
            </TableCell>
            <TableCell sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ justifyContent: { xs: 'center', sm: 'flex-end' }, alignItems: 'center' }}
              >
                Effective rate
                <Tooltip title={appendixText.effectiveRate}>
                  <InfoOutlinedIcon
                    sx={{
                      cursor: 'help',
                      fontSize: { sm: '1.1rem', md: '1.25rem' },
                      display: { xs: 'none', sm: 'inline-block' },
                      color: 'primary.main',
                      ml: 0.75,
                    }}
                    className="print-hide"
                  />
                </Tooltip>
              </Stack>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {byYear.map((row) => (
            <TableRow key={row.year}>
              <TableCell>{row.year}</TableCell>
              <TableCell align="right">£{row.amountInvested.toFixed(2)}</TableCell>
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
            <TableCell align="right">
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 'inherit' }}>
                £{overall.totalInvested.toFixed(2)}
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

      {/* Mobile-only appendix */}
      <Typography
        variant="body2"
        sx={{ fontSize: '0.75rem', display: { xs: 'block', sm: 'none' } }}
        color="text.secondary"
      >
        <strong>Effective rate:</strong> {appendixText.effectiveRate}
      </Typography>
    </Stack>
  )
}

export default BondResultsTable
