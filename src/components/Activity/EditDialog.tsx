import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
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
  onUpdatePrize: (
    id: string,
    data: TNewPrize,
    reinvested: boolean,
    existingReinvestmentId: string | null,
  ) => Promise<void>;
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
    trigger,
    formState: { errors, isValid },
  } = useForm<TTransactionFormValues>({
    mode: 'onChange',
    defaultValues: { month: '', year: '', type: 'deposit' },
  });

  const [reinvested, setReinvested] = useState(false);
  // Re-validate amount when type or date changes so the withdrawal balance check updates
  const mounted = useRef(false);

  const watchedType = useWatch({ control, name: 'type' });
  const watchedMonth = useWatch({ control, name: 'month' });
  const watchedYear = useWatch({ control, name: 'year' });

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

    if (editTarget.itemType === 'prize') {
      const hasReinvestment = transactions.some(
        (t) =>
          t.type === 'reinvestment' && t.date === editTarget.date && t.amount === editTarget.amount,
      );
      setReinvested(hasReinvestment);
    }

    reset({ year, month, amount: editTarget.amount, ...(type ? { type } : {}) });
  }, [editTarget, transactions, reset]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    void trigger('amount');
  }, [watchedType, watchedMonth, watchedYear, trigger]);

  // Balance at the selected date excluding this transaction — used for withdrawal validation
  const maxWithdrawal = useMemo(() => {
    if (editTarget?.itemType !== 'transaction' || !watchedYear || !watchedMonth) {
      return 0;
    }

    const selectedDate = `${watchedYear}-${watchedMonth}`;

    return transactions
      .filter((t) => t.id !== editTarget.id && t.date <= selectedDate)
      .reduce((sum, t) => (t.type === 'withdrawal' ? sum - t.amount : sum + t.amount), 0);
  }, [transactions, editTarget, watchedYear, watchedMonth]);

  const handleEditSubmit = async ({ month, year, amount, type }: TTransactionFormValues) => {
    if (!editTarget) {
      return;
    }

    const date = toYearMonth(year, month);

    if (editTarget.itemType === 'transaction') {
      await onUpdateTransaction(editTarget.id, { date, amount, type });
    } else {
      const existingReinvestment =
        transactions.find(
          (t) =>
            t.type === 'reinvestment' &&
            t.date === editTarget.date &&
            t.amount === editTarget.amount,
        ) ?? null;

      await onUpdatePrize(
        editTarget.id,
        { date, amount },
        reinvested,
        existingReinvestment?.id ?? null,
      );
    }

    onClose();
  };

  const isReinvestment =
    editTarget?.itemType === 'transaction' && editTarget.type === 'reinvestment';

  return (
    <Dialog open={!!editTarget} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Edit {isReinvestment ? 'reinvestment' : editTarget?.itemType}</DialogTitle>
      <DialogContent>
        {isReinvestment ? (
          <Typography sx={{ mt: 1 }}>
            Reinvestments are linked to a prize. To change the amount or date, edit the
            corresponding prize instead.
          </Typography>
        ) : (
          <EditForm
            control={control}
            register={register}
            errors={errors}
            getValues={getValues}
            isTransaction={editTarget?.itemType === 'transaction'}
            editTarget={editTarget}
            transactions={transactions}
            reinvested={reinvested}
            onReinvestedChange={setReinvested}
            maxWithdrawal={maxWithdrawal}
          />
        )}
      </DialogContent>
      <DialogActions>
        {isReinvestment ? (
          <Button onClick={onClose}>Close</Button>
        ) : (
          <>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              variant="contained"
              disabled={!isValid}
              onClick={handleSubmit(handleEditSubmit)}
            >
              Save
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
