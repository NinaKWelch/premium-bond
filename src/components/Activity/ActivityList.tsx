'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { TTransaction, TPrize, TActivityItem, TNewTransaction, TNewPrize } from '#types/bonds';
import { formatYearMonth } from '#utils/date';
import ActivityTable from './ActivityTable';
import DeleteDialog from './DeleteDialog';
import EditDialog from './EditDialog';
import { displayLabel, ActionButtons } from './activityHelpers';

interface IActivityListProps {
  transactions: TTransaction[];
  prizes: TPrize[];
  onUpdateTransaction: (id: string, data: TNewTransaction) => Promise<void>;
  onDeleteTransaction: (id: string) => Promise<void>;
  onUpdatePrize: (id: string, data: TNewPrize) => Promise<void>;
  onDeletePrize: (id: string) => Promise<void>;
}

const borderColor = {
  deposit: '#4caf50',
  prize: '#0288d1',
  withdrawal: '#d32f2f',
  reinvestment: '#9c27b0',
};

const ActivityList = ({
  transactions,
  prizes,
  onUpdateTransaction,
  onDeleteTransaction,
  onUpdatePrize,
  onDeletePrize,
}: IActivityListProps) => {
  const [deleteTarget, setDeleteTarget] = useState<TActivityItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<TActivityItem | null>(null);

  const itemOrder = (item: TActivityItem): number => {
    if (item.itemType === 'prize') {
      return 0;
    }

    if (item.type === 'reinvestment') {
      return 1;
    }

    return 2;
  };

  const items: TActivityItem[] = [
    ...transactions.map((t) => ({ ...t, itemType: 'transaction' as const })),
    ...prizes.map((p) => ({ ...p, itemType: 'prize' as const })),
  ].sort((a, b) => a.date.localeCompare(b.date) || itemOrder(a) - itemOrder(b));

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      if (deleteTarget.itemType === 'transaction') {
        await onDeleteTransaction(deleteTarget.id);
      } else {
        await onDeletePrize(deleteTarget.id);
      }

      setDeleteTarget(null);
      setDeleteError(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (items.length === 0) {
    return <Typography color="text.secondary">No activity yet.</Typography>;
  }

  return (
    <>
      {/* Mobile: card list */}
      <Stack spacing={1.5} sx={{ display: { xs: 'flex', sm: 'none' } }}>
        {items.map((item) => {
          const itemKind = 'type' in item ? item.type : 'prize';
          const isWithdrawal = itemKind === 'withdrawal';
          const formattedAmount = isWithdrawal
            ? `-£${item.amount.toFixed(2)}`
            : `£${item.amount.toFixed(2)}`;

          return (
            <Box
              key={`${item.itemType}-${item.id}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${borderColor[itemKind]}`,
                borderRadius: 1,
                px: 2,
                py: 1.5,
                bgcolor: 'background.paper',
                boxShadow: 1,
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  {formatYearMonth(item.date)}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                  {displayLabel(itemKind)}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', color: isWithdrawal ? 'error.main' : 'inherit' }}
                >
                  {formattedAmount}
                </Typography>
              </Box>
              <ActionButtons
                onEdit={() => setEditTarget(item)}
                onDelete={() => setDeleteTarget(item)}
                mobileWhiteBg
              />
            </Box>
          );
        })}
      </Stack>

      {/* Tablet/desktop: table */}
      <ActivityTable items={items} onEdit={setEditTarget} onDelete={setDeleteTarget} />

      <DeleteDialog
        target={deleteTarget}
        error={deleteError}
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          setDeleteTarget(null);
          setDeleteError(null);
        }}
      />

      <EditDialog
        editTarget={editTarget}
        transactions={transactions}
        onUpdateTransaction={onUpdateTransaction}
        onUpdatePrize={onUpdatePrize}
        onClose={() => setEditTarget(null)}
      />
    </>
  );
};

export default ActivityList;
