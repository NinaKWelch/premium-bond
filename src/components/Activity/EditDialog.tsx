import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type {
  TTransaction,
  TActivityItem,
  TNewTransaction,
  TNewPrize,
  TTransactionFormValues,
} from '#types/bonds';
import { toYearMonth, fromYearMonth } from '#utils/date';
import EditForm from './EditForm';

interface IEditDialogProps {
  editTarget: TActivityItem | null;
  transactions: TTransaction[];
  onUpdateTransaction: (id: string, data: TNewTransaction) => Promise<void>;
  onUpdatePrize: (id: string, data: TNewPrize) => Promise<void>;
  onClose: () => void;
}

const EditDialog = ({
  editTarget,
  transactions,
  onUpdateTransaction,
  onUpdatePrize,
  onClose,
}: IEditDialogProps) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm<TTransactionFormValues>({
    mode: 'onChange',
    defaultValues: { month: '', year: '', type: 'deposit' },
  });

  useEffect(() => {
    if (!editTarget) {
      return;
    }

    const { year, month } = fromYearMonth(editTarget.date);
    const type =
      'type' in editTarget
        ? editTarget.type === 'reinvestment'
          ? 'deposit'
          : editTarget.type
        : undefined;

    reset({ year, month, amount: editTarget.amount, ...(type ? { type } : {}) });
  }, [editTarget, reset]);

  const handleEditSubmit = async ({ month, year, amount, type }: TTransactionFormValues) => {
    if (!editTarget) {
      return;
    }

    const date = toYearMonth(year, month);

    if (editTarget.itemType === 'transaction') {
      await onUpdateTransaction(editTarget.id, { date, amount, type });
    } else {
      await onUpdatePrize(editTarget.id, { date, amount });
    }

    onClose();
  };

  return (
    <Dialog open={!!editTarget} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Edit {editTarget?.itemType}</DialogTitle>
      <DialogContent>
        <EditForm
          control={control}
          register={register}
          errors={errors}
          getValues={getValues}
          isTransaction={editTarget?.itemType === 'transaction'}
          editTarget={editTarget}
          transactions={transactions}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!isValid} onClick={handleSubmit(handleEditSubmit)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
