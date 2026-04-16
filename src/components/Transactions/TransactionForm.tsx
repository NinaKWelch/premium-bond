import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import type { TTransactionFormValues, TNewTransaction } from '#types/bonds';
import { transactionFormSchema } from '#schemas/bonds.schemas';
import { MONTHS, currentYear, toYearMonth } from '#utils/date';
import {
  PREMIUM_BONDS_LAUNCH_YEAR,
  MIN_TRANSACTION_AMOUNT,
  MAX_TRANSACTION_AMOUNT,
} from '#constants';

interface ITransactionFormProps {
  onSubmit: (data: TNewTransaction) => Promise<void>
}

const TransactionForm = ({ onSubmit }: ITransactionFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(transactionFormSchema),
    mode: 'onChange',
    defaultValues: { type: 'deposit' as const, month: '', year: '' },
  });

  const submit = async ({ month, year, amount, type }: TTransactionFormValues) => {
    await onSubmit({ date: toYearMonth(year, month), amount, type });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <Controller
            name="month"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.month}>
                <InputLabel id="txn-month-label">Month</InputLabel>
                <Select labelId="txn-month-label" label="Month" {...field} value={field.value}>
                  {MONTHS.map((m) => (
                    <MenuItem key={m.value} value={m.value}>
                      {m.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <TextField
            label="Year"
            type="number"
            fullWidth
            slotProps={{
              htmlInput: { min: PREMIUM_BONDS_LAUNCH_YEAR, max: currentYear(), step: 1 },
            }}
            error={!!errors.year}
            helperText={errors.year?.message}
            {...register('year')}
          />
        </Stack>

        <TextField
          label="Amount (£)"
          type="number"
          fullWidth
          slotProps={{
            htmlInput: { min: MIN_TRANSACTION_AMOUNT, max: MAX_TRANSACTION_AMOUNT, step: 1 },
          }}
          error={!!errors.amount}
          helperText={errors.amount?.message}
          {...register('amount')}
        />

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="txn-type-label">Type</InputLabel>
              <Select labelId="txn-type-label" label="Type" {...field}>
                <MenuItem value="deposit">Deposit</MenuItem>
                <MenuItem value="withdrawal">Withdrawal</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!isValid}
          loading={isSubmitting}
          sx={{ height: 56, fontSize: '1rem' }}
        >
          Add transaction
        </Button>
      </Stack>
    </form>
  );
};

export default TransactionForm;
