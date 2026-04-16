import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { TSimpleFormValues, TSimpleResult } from '../../types/bonds';
import { lastMonth } from '../../utils/date';
import { estimateEffectiveRate } from '../../utils/rateEstimator';
import SimpleCalculatorForm from './SimpleCalculatorForm';
import SimpleCalculatorResult from './SimpleCalculatorResult';

const SimpleCalculator = () => {
  const [result, setResult] = useState<TSimpleResult | null>(null);

  const calculate = ({ firstInvestmentMonth, totalInvested, totalPrizes }: TSimpleFormValues) => {
    setResult(estimateEffectiveRate(firstInvestmentMonth, totalInvested, totalPrizes));
  };

  return (
    <Box className="print-hide">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Quick rate estimate
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Get a rough idea of your effective annual return. Enter the month you first bought
            bonds, the total amount you have invested overall, and the total prizes you have won —
            excluding any amounts you reinvested.
          </Typography>
        </Box>

        <SimpleCalculatorForm
          defaultMonth={lastMonth()}
          onSubmit={calculate}
          onChange={() => setResult(null)}
        />

        {result && <SimpleCalculatorResult result={result} />}
      </Stack>
    </Box>
  );
};

export default SimpleCalculator;
