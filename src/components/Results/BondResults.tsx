import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { TResults } from '#types/bonds';
import { NS_AND_I_PRIZE_FUND_RATE_PCT } from '#constants';
import BondResultsTable from './BondResultsTable';

interface IBondResultsProps {
  results: TResults
}

const BondResults = ({ results }: IBondResultsProps) => {
  const { byYear, overall } = results;
  const diff = overall.averageAnnualRatePct - NS_AND_I_PRIZE_FUND_RATE_PCT;
  const beatRate = diff >= 0;

  // What the same average balances would have earned at the advertised prize fund rate
  const hypotheticalTotal = byYear.reduce(
    (sum, row) => sum + row.averageBalance * (NS_AND_I_PRIZE_FUND_RATE_PCT / 100),
    0,
  );
  const amountDiff = Math.abs(hypotheticalTotal - overall.totalPrizesWon);

  return (
    <Stack spacing={3}>
      <Box
        component="ul"
        sx={{ m: 0, pl: 2, py: 2, pr: 2, bgcolor: 'grey.100', borderRadius: 1, listStyle: 'none' }}
      >
        {[
          { term: 'Amount invested', def: 'Net deposits or withdrawals you made that year.' },
          { term: 'Prizes won', def: 'Total prize money credited to you that year.' },
          {
            term: 'Avg balance',
            def: 'Time-weighted average amount held — money deposited or withdrawn mid-year is counted proportionally.',
          },
          {
            term: 'Effective rate',
            def: 'What a savings account would need to pay to match your prize winnings that year.',
          },
        ].map(({ term, def }) => (
          <Typography
            key={term}
            component="li"
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
          >
            <strong>{term}:</strong> {def}
          </Typography>
        ))}
      </Box>

      <BondResultsTable results={results} />

      <Stack spacing={2}>
        <Typography variant="body1" color="text.secondary">
          Your overall effective rate was{' '}
          <strong>{overall.averageAnnualRatePct.toFixed(2)}%</strong> per year, based on{' '}
          <strong>£{overall.totalPrizesWon.toFixed(2)}</strong> in total prizes. NS&amp;I currently
          advertises a prize fund rate of <strong>{NS_AND_I_PRIZE_FUND_RATE_PCT}%</strong>. You{' '}
          <strong style={{ color: beatRate ? '#388e3c' : 'inherit' }}>
            {beatRate
              ? `beat it by ${diff.toFixed(2)} percentage points`
              : `fell ${Math.abs(diff).toFixed(2)} percentage points short`}
          </strong>
          .
        </Typography>

        {overall.cashDeposited !== overall.totalInvested && (
          <Typography variant="body1" color="text.secondary">
            Of the <strong>£{overall.totalInvested.toFixed(2)}</strong> net balance, you personally
            deposited <strong>£{overall.cashDeposited.toFixed(2)}</strong> in cash (net of any
            withdrawals) — the remaining{' '}
            <strong>£{(overall.totalInvested - overall.cashDeposited).toFixed(2)}</strong> came from
            reinvested prizes.
          </Typography>
        )}

        {beatRate ? (
          <Typography variant="body1" color="text.secondary">
            You came out ahead — your prizes totalled{' '}
            <strong>£{overall.totalPrizesWon.toFixed(2)}</strong>, compared to the{' '}
            <strong>£{hypotheticalTotal.toFixed(2)}</strong> you&apos;d have earned at the
            advertised rate. That&apos;s <strong>£{amountDiff.toFixed(2)} more</strong> in your
            pocket. Premium Bonds worked in your favour — though keep in mind the advertised rate is
            a statistical average, and individual results vary by luck.
          </Typography>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Your prizes totalled <strong>£{overall.totalPrizesWon.toFixed(2)}</strong>, compared to
            the <strong>£{hypotheticalTotal.toFixed(2)}</strong> you&apos;d have earned at the
            advertised rate — <strong>£{amountDiff.toFixed(2)} less</strong> overall. This is
            normal, as the advertised rate is a statistical average and results vary by luck. If
            your returns are consistently below average, it may be worth considering a NS&amp;I
            savings account, which offers a guaranteed interest rate on your balance.
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default BondResults;
