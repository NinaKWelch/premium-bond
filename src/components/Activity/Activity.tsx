import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ActivityList from './ActivityList';
import useBonds from '#context/useBonds';

const Activity = () => {
  const {
    transactions,
    prizes,
    handleTransactionUpdate,
    handleTransactionDelete,
    handlePrizeUpdate,
    handlePrizeDelete,
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
      </Stack>
    </Box>
  );
};

export default Activity;
