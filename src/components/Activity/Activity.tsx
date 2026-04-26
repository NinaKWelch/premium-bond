'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ActivityList from './ActivityList';
import ClearAllDialog from './ClearAllDialog';
import useBonds from '#context/useBonds';

const Activity = () => {
  const {
    transactions,
    prizes,
    handleTransactionUpdate,
    handleTransactionDelete,
    handlePrizeUpdate,
    handlePrizeDelete,
    handleClearAll,
  } = useBonds();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const hasActivity = transactions.length > 0 || prizes.length > 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Activity
        </Typography>
        {hasActivity && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            className="print-hide"
            onClick={() => setConfirmOpen(true)}
          >
            Clear all
          </Button>
        )}
      </Box>
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

      <ClearAllDialog
        open={confirmOpen}
        onConfirm={() => {
          void handleClearAll().then(() => setConfirmOpen(false));
        }}
        onClose={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default Activity;
