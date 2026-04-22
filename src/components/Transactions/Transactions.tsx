'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { TNewTransaction, TTransaction } from '#types/bonds';
import TransactionForm from './TransactionForm';

interface ITransactionsProps {
  onSubmit: (data: TNewTransaction) => Promise<void>;
  transactions: TTransaction[];
}

const Transactions = ({ onSubmit, transactions }: ITransactionsProps) => (
  <Box>
    <Typography variant="h5" component="h2" gutterBottom>
      Transactions
    </Typography>
    <TransactionForm onSubmit={onSubmit} transactions={transactions} />
  </Box>
);

export default Transactions;
