'use client';

import Typography from '@mui/material/Typography';
import { NS_AND_I_PRIZE_FUND_RATE_PCT } from '#constants';
import type { TSimpleResult } from '#types/bonds';

interface ISimpleCalculatorResultProps {
  result: TSimpleResult;
}

const SimpleCalculatorResult = ({ result }: ISimpleCalculatorResultProps) => {
  const diff = result.effectiveRatePct - NS_AND_I_PRIZE_FUND_RATE_PCT;
  const beatRate = diff >= 0;

  return (
    <Typography variant="body1" color="text.secondary">
      Over <strong>{result.years.toFixed(1)} years</strong>, your effective annual return on
      investment is <strong>{result.effectiveRatePct.toFixed(2)}%</strong>. NS&amp;I currently
      advertises a prize fund rate of <strong>{NS_AND_I_PRIZE_FUND_RATE_PCT}%</strong>. You{' '}
      <strong style={{ color: beatRate ? '#388e3c' : 'inherit' }}>
        {beatRate
          ? `beat that by ${diff.toFixed(2)} percentage points`
          : `came in ${Math.abs(diff).toFixed(2)} percentage points below it`}
      </strong>
      . Keep in mind this is a rough estimate — for a precise year-by-year breakdown, use the{' '}
      <Typography
        component="a"
        href="/dashboard"
        variant="body1"
        color="primary"
        sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
      >
        detailed tracker
      </Typography>
      .
    </Typography>
  );
};

export default SimpleCalculatorResult;
