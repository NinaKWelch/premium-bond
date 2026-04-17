'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PrizeForm from './PrizeForm';

import type { TPrizeFormValues } from '#types/bonds';

interface IPrizesProps {
  onSubmit: (data: TPrizeFormValues) => Promise<void>;
  firstDepositDate: string | null;
}

const Prizes = ({ onSubmit, firstDepositDate }: IPrizesProps) => (
  <Box>
    <Typography variant="h5" component="h2" gutterBottom>
      Prizes
    </Typography>
    {firstDepositDate === null ? (
      <Typography color="text.secondary">Add a deposit before recording prizes.</Typography>
    ) : (
      <PrizeForm onSubmit={onSubmit} firstDepositDate={firstDepositDate} />
    )}
  </Box>
);

export default Prizes;
