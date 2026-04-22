'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Resolver, ResolverOptions } from 'react-hook-form';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import type { TTransactionFormValues, TNewTransaction, TTransaction } from '#types/bonds';
import { createTransactionFormSchema } from '#schemas/bonds.schemas';
import { MONTHS, YEARS, toYearMonth } from '#utils/date';
import { MIN_TRANSACTION_AMOUNT, MAX_TRANSACTION_AMOUNT } from '#constants';

interface ITransactionFormProps {
  onSubmit: (data: TNewTransaction) => Promise<void>;
  transactions: TTransaction[];
}

const TransactionForm = ({ onSubmit, transactions }: ITransactionFormProps) => {
  // Holds the balance at the selected date; updated during render so the
  // resolver always sees the latest value when trigger() fires in an effect.
  const balanceRef = useRef(0);

  // z.coerce.number() has input type `unknown` but TTransactionFormValues uses the output
  // type `number`. The cast is the only way to bridge this zod/react-hook-form coerce gap.
  const resolver = useCallback(
    (
      values: z.input<ReturnType<typeof createTransactionFormSchema>>,
      context: unknown,
      options: ResolverOptions<TTransactionFormValues>,
    ) =>
      zodResolver(createTransactionFormSchema(balanceRef.current))(
        values,
        context,
        options as ResolverOptions<z.input<ReturnType<typeof createTransactionFormSchema>>>,
      ),
    [],
  ) as Resolver<TTransactionFormValues>;

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    trigger,
    formState: { errors, isValid, isSubmitting, touchedFields },
  } = useForm<TTransactionFormValues>({
    resolver,
    mode: 'onChange',
    defaultValues: { type: 'deposit', month: '', year: '' },
  });

  const watchedType = useWatch({ control, name: 'type' });
  const watchedMonth = useWatch({ control, name: 'month' });
  const watchedYear = useWatch({ control, name: 'year' });

  // Keep balanceRef current. Declared before the trigger effect so React runs
  // it first when both fire in the same render (effects run in declaration order).
  useEffect(() => {
    if (watchedYear && watchedMonth) {
      const selectedDate = `${watchedYear}-${watchedMonth}`;
      balanceRef.current = transactions
        .filter((t) => t.date <= selectedDate)
        .reduce((sum, t) => (t.type === 'withdrawal' ? sum - t.amount : sum + t.amount), 0);
    } else {
      balanceRef.current = 0;
    }
  }, [transactions, watchedYear, watchedMonth]);

  // Re-validate amount when type or date changes, but not on initial mount
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    void trigger('amount');
  }, [watchedType, watchedMonth, watchedYear, trigger]);

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
