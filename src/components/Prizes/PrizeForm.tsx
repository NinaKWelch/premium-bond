'use client';

import { useEffect, useMemo } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import type { TPrizeFormValues } from '#types/bonds';
import { prizeFormSchema } from '#schemas/bonds.schemas';
import { MONTHS, YEARS } from '#utils/date';
import { MIN_PRIZE_AMOUNT, MAX_PRIZE_AMOUNT } from '#constants';

interface IPrizeFormProps {
  onSubmit: (data: TPrizeFormValues) => Promise<void>;
  firstDepositDate: string | null;
}

const PrizeForm = ({ onSubmit, firstDepositDate }: IPrizeFormProps) => {
  const schema = useMemo(() => {
    if (!firstDepositDate) {
      return prizeFormSchema;
    }

    const firstDepositYear = firstDepositDate.slice(0, 4);

    return prizeFormSchema.superRefine((data, ctx) => {
      if (!data.year) {
        return;
      }

      if (data.year < firstDepositYear) {
        ctx.addIssue({
          code: 'custom',
          path: ['year'],
          message: `Prizes can only be won after your first deposit in ${firstDepositDate.replace('-', '/')}`,
        });
      } else if (data.month && `${data.year}-${data.month}` <= firstDepositDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['month'],
          message: 'Prize date must be after the month of your first deposit',
        });
      }
    });
  }, [firstDepositDate]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { month: '', year: '', reinvested: false },
  });

  const watchYear = useWatch({ control, name: 'year' });
  const watchMonth = useWatch({ control, name: 'month' });

  // Re-trigger both fields whenever either changes so cross-field errors always show
  useEffect(() => {
    if (watchMonth || watchYear) {
      void trigger(['month', 'year']);
    }
  }, [watchYear, watchMonth, trigger]);

  const submit = async (values: TPrizeFormValues) => {
    await onSubmit(values);
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
                <InputLabel id="prize-month-label">Month</InputLabel>
                <Select labelId="prize-month-label" label="Month" {...field} value={field.value}>
                  {MONTHS.map((m) => (
                    <MenuItem key={m.value} value={m.value}>
                      {m.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.month && <FormHelperText>{errors.month.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.year}>
                <InputLabel id="prize-year-label">Year</InputLabel>
                <Select labelId="prize-year-label" label="Year" {...field} value={field.value}>
                  {YEARS.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
                {errors.year && <FormHelperText>{errors.year.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </Stack>

        <TextField
          label="Amount (£)"
          type="number"
          fullWidth
          slotProps={{ htmlInput: { min: MIN_PRIZE_AMOUNT, max: MAX_PRIZE_AMOUNT, step: 1 } }}
          error={!!errors.amount}
          helperText={errors.amount?.message}
          {...register('amount')}
        />

        <Controller
          name="reinvested"
          control={control}
          render={({ field }) => (
            <Box sx={{ height: 56, display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="Was this prize reinvested?"
              />
            </Box>
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
          Add prize
        </Button>
      </Stack>
    </form>
  );
};

export default PrizeForm;
