'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Transactions from '#components/Transactions';
import Prizes from '#components/Prizes';
import useBonds from '#context/useBonds';

const Calculator = () => {
  const { transactions, handleTransactionSubmit, handlePrizeSubmit } = useBonds();

  const firstDepositDate =
    transactions.filter((t) => t.type === 'deposit').sort((a, b) => a.date.localeCompare(b.date))[0]
      ?.date ?? null;

  return (
    <>
      <Box className="print-hide">
        <Typography variant="h5" component="h2" gutterBottom>
          Detailed rate breakdown
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Calculates your effective annual return year by year, based on the exact dates and amounts
          of your deposits, withdrawals, and prizes. The average balance accounts for how long each
          deposit was actually held during the year.
        </Typography>
        <Typography variant="body2" color="text.secondary" component="ol" sx={{ pl: 2 }}>
          <li>Add each deposit and withdrawal in the Transactions section below.</li>
          <li>Add each prize in the Prizes section below, using the date NS&amp;I credited it.</li>
          <li>If you made a mistake, you can edit or delete an entry in the Activity section.</li>
          <li>Click Calculate Detailed Rate at the bottom to see your year-by-year breakdown.</li>
        </Typography>
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} className="print-hide">
        <Box sx={{ flex: 1 }}>
          <Transactions onSubmit={handleTransactionSubmit} transactions={transactions} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Prizes onSubmit={handlePrizeSubmit} firstDepositDate={firstDepositDate} />
        </Box>
      </Stack>
    </>
  );
};

export default Calculator;
