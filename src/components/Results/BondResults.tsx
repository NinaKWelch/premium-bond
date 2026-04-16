import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { TResults } from '../../types/bonds'
import { NS_AND_I_PRIZE_FUND_RATE_PCT } from '../../constants'
import BondResultsTable from './BondResultsTable'

interface IBondResultsProps {
  results: TResults
}

const BondResults = ({ results }: IBondResultsProps) => {
  const { overall } = results
  const diff = overall.averageAnnualRatePct - NS_AND_I_PRIZE_FUND_RATE_PCT
  const beatRate = diff >= 0

  return (
    <Stack spacing={3}>
      <BondResultsTable results={results} />

      <Stack spacing={1}>
        <Typography variant="body1" color="text.secondary">
          The table above shows your year-by-year breakdown. <strong>Amount invested</strong> is the
          net deposits or withdrawals you made that year. <strong>Prizes won</strong> is the total
          prize money credited to you. <strong>Avg balance</strong> is the time-weighted average
          amount you had invested — money held for only part of the year is counted proportionally.{' '}
          <strong>Effective rate</strong> is what a savings account would need to pay to match your
          prize winnings that year.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your overall return on investment was{' '}
          <strong>{overall.averageAnnualRatePct.toFixed(2)}%</strong> per year, based on{' '}
          <strong>£{overall.totalPrizesWon.toFixed(2)}</strong> in prizes won across all years.
          NS&amp;I currently advertises a prize fund rate of{' '}
          <strong>{NS_AND_I_PRIZE_FUND_RATE_PCT}%</strong>. You{' '}
          <strong style={{ color: beatRate ? '#388e3c' : 'inherit' }}>
            {beatRate
              ? `beat that by ${diff.toFixed(2)} percentage points`
              : `came in ${Math.abs(diff).toFixed(2)} percentage points below it`}
          </strong>
          . This is expected — the advertised rate is a statistical average across all bond holders,
          so individual results vary based on luck.
        </Typography>
      </Stack>
    </Stack>
  )
}

export default BondResults
