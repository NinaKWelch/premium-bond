import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import type { TPrizeFormValues } from '../../types/bonds';
import { MONTHS, currentYear } from '../../utils/date';
import { PREMIUM_BONDS_LAUNCH_YEAR, MIN_PRIZE_AMOUNT, MAX_PRIZE_AMOUNT } from '../../constants';

interface IPrizeFormProps {
  onSubmit: (data: TPrizeFormValues) => Promise<void>
}

const PrizeForm = ({ onSubmit }: IPrizeFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TPrizeFormValues>({
    mode: 'onChange',
    defaultValues: { month: '', year: '', reinvested: false },
  });

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
            rules={{ required: 'Month is required' }}
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
            {...register('year', {
              required: 'Year is required',
              min: {
                value: PREMIUM_BONDS_LAUNCH_YEAR,
                message: `Year must be ${PREMIUM_BONDS_LAUNCH_YEAR} or later`,
              },
              max: { value: currentYear(), message: `Year must be ${currentYear()} or earlier` },
            })}
          />
        </Stack>

        <TextField
          label="Amount (£)"
          type="number"
          fullWidth
          slotProps={{ htmlInput: { min: MIN_PRIZE_AMOUNT, max: MAX_PRIZE_AMOUNT, step: 1 } }}
          error={!!errors.amount}
          helperText={errors.amount?.message}
          {...register('amount', {
            required: 'Amount is required',
            valueAsNumber: true,
            min: { value: MIN_PRIZE_AMOUNT, message: `Minimum prize is £${MIN_PRIZE_AMOUNT}` },
            max: {
              value: MAX_PRIZE_AMOUNT,
              message: `Maximum prize is £${MAX_PRIZE_AMOUNT.toLocaleString()}`,
            },
          })}
        />

        <Controller
          name="reinvested"
          control={control}
          defaultValue={false}
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
