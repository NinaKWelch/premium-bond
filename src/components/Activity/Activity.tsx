import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ActivityList from './ActivityList';
import Export from '../Export';
import useBonds from '../../context/useBonds';

const Activity = () => {
  const {
    transactions,
    prizes,
    handleTransactionUpdate,
    handleTransactionDelete,
    handlePrizeUpdate,
    handlePrizeDelete,
    handlePrint,
  } = useBonds();

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Activity
      </Typography>
      <Stack spacing={3}>
        <ActivityList
          transactions={transactions}
          prizes={prizes}
          onUpdateTransaction={handleTransactionUpdate}
          onDeleteTransaction={handleTransactionDelete}
          onUpdatePrize={handlePrizeUpdate}
          onDeletePrize={handlePrizeDelete}
        />
        {(transactions.length > 0 || prizes.length > 0) && (
          <Export transactions={transactions} prizes={prizes} onPrint={handlePrint} />
        )}
      </Stack>
    </Box>
  );
};

export default Activity;
