import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { TNewTransaction } from '../../types/bonds'
import TransactionForm from './TransactionForm'

interface ITransactionsProps {
  onSubmit: (data: TNewTransaction) => Promise<void>
}

const Transactions = ({ onSubmit }: ITransactionsProps) => (
  <Box>
    <Typography variant="h5" component="h2" gutterBottom>
      Transactions
    </Typography>
    <TransactionForm onSubmit={onSubmit} />
  </Box>
)

export default Transactions
