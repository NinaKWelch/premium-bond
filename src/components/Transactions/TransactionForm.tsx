'use client';

import { useCallback, useEffect, useRef, useMemo } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import type { TTransactionFormValues, TNewTransaction } from '#types/bonds';
import { createTransactionFormSchema } from '#schemas/bonds.schemas';
import { MONTHS, YEARS, toYearMonth } from '#utils/date';
import { MIN_TRANSACTION_AMOUNT, MAX_TRANSACTION_AMOUNT } from '#constants';

interface ITransactionFormProps {
  onSubmit: (data: TNewTransaction) => Promise<void>;
  balance: number;
}

const TransactionForm = ({ onSubmit, balance }: ITransactionFormProps) => {
  const schema = useMemo(() => createTransactionFormSchema(balance), [balance]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    trigger,
    formState: { errors, isValid, isSubmitting, touchedFields },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { type: 'deposit' as const, month: '', year: '' },
  });

  const watchedType = useWatch({ control, name: 'type' });

  // Re-validate amount when type changes, but not on the initial mount
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    void trigger('amount');
  }, [watchedType, trigger]);

  const submit = useCallback(
    async ({ month, year, amount, type }: TTransactionFormValues) => {
      try {
        await onSubmit({ date: toYearMonth(year, month), amount, type });
        reset();
      } catch (err) {
        setError('amount', {
          message: err instanceof Error ? err.message : 'Failed to add transaction',
        });
      }
    },
    [onSubmit, reset, setError],
  );

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <Controller
            name="month"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.month && !!touchedFields.month}>
                <InputLabel id="txn-month-label">Month</InputLabel>
                <Select labelId="txn-month-label" label="Month" {...field} value={field.value}>
                  {MONTHS.map((m) => (
                    <MenuItem key={m.value} value={m.value}>
                      {m.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.month && touchedFields.month && (
                  <FormHelperText>{errors.month.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.year && !!touchedFields.year}>
                <InputLabel id="txn-year-label">Year</InputLabel>
                <Select labelId="txn-year-label" label="Year" {...field} value={field.value}>
                  {YEARS.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
                {errors.year && touchedFields.year && (
                  <FormHelperText>{errors.year.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Stack>

        <TextField
          label="Amount (£)"
          type="number"
          fullWidth
          slotProps={{
            htmlInput: { min: MIN_TRANSACTION_AMOUNT, max: MAX_TRANSACTION_AMOUNT, step: 1 },
          }}
          error={!!errors.amount && !!touchedFields.amount}
          helperText={touchedFields.amount ? errors.amount?.message : undefined}
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
