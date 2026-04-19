import { Controller } from 'react-hook-form';
import type { Control, UseFormRegister, FieldErrors, UseFormGetValues } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { TTransaction, TActivityItem, TTransactionFormValues } from '#types/bonds';
import { MONTHS, YEARS, currentMonth } from '#utils/date';
import {
  MIN_TRANSACTION_AMOUNT,
  MAX_TRANSACTION_AMOUNT,
  MIN_PRIZE_AMOUNT,
  MAX_PRIZE_AMOUNT,
} from '#constants';

interface IEditFormProps {
  control: Control<TTransactionFormValues>;
  register: UseFormRegister<TTransactionFormValues>;
  errors: FieldErrors<TTransactionFormValues>;
  getValues: UseFormGetValues<TTransactionFormValues>;
  isTransaction: boolean;
  editTarget: TActivityItem | null;
  transactions: TTransaction[];
}

const EditForm = ({
  control,
  register,
  errors,
  getValues,
  isTransaction,
  editTarget,
  transactions,
}: IEditFormProps) => (
  <Stack spacing={2} sx={{ mt: 1 }}>
    <Stack direction="row" spacing={2}>
      <Controller
        name="month"
        control={control}
        rules={{ required: 'Month is required' }}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.month}>
            <InputLabel id="edit-month-label">Month</InputLabel>
            <Select labelId="edit-month-label" label="Month" {...field} value={field.value}>
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
        rules={{
          required: 'Year is required',
          validate: (year) => {
            const month = getValues('month');
            if (month && `${year}-${month}` > currentMonth()) {
              return 'Date cannot be in the future';
            }
            if (editTarget?.itemType === 'prize') {
              const firstDeposit = transactions
                .filter((t) => t.type === 'deposit')
                .sort((a, b) => a.date.localeCompare(b.date))[0] as TTransaction | undefined;
              if (firstDeposit && `${year}-${month}` <= firstDeposit.date) {
                return 'Prize date must be after the month of your first deposit';
              }
            }
            return true;
          },
        }}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.year}>
            <InputLabel id="edit-year-label">Year</InputLabel>
            <Select labelId="edit-year-label" label="Year" {...field} value={field.value}>
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
      slotProps={{
        htmlInput: {
          min: isTransaction ? MIN_TRANSACTION_AMOUNT : MIN_PRIZE_AMOUNT,
          max: isTransaction ? MAX_TRANSACTION_AMOUNT : MAX_PRIZE_AMOUNT,
          step: 1,
        },
      }}
      fullWidth
      error={!!errors.amount}
      helperText={errors.amount?.message}
      {...register('amount', {
        required: 'Amount is required',
        valueAsNumber: true,
        min: isTransaction
          ? {
              value: MIN_TRANSACTION_AMOUNT,
              message: `Amount must be at least £${MIN_TRANSACTION_AMOUNT}`,
            }
          : { value: MIN_PRIZE_AMOUNT, message: `Minimum prize is £${MIN_PRIZE_AMOUNT}` },
        max: isTransaction
          ? {
              value: MAX_TRANSACTION_AMOUNT,
              message: `Maximum holding is £${MAX_TRANSACTION_AMOUNT.toLocaleString()}`,
            }
          : {
              value: MAX_PRIZE_AMOUNT,
              message: `Maximum prize is £${MAX_PRIZE_AMOUNT.toLocaleString()}`,
            },
      })}
    />
    {isTransaction && (
      <Controller
        name="type"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel id="edit-type-label">Type</InputLabel>
            <Select labelId="edit-type-label" label="Type" {...field} value={field.value}>
              <MenuItem value="deposit">Deposit</MenuItem>
              <MenuItem value="withdrawal">Withdrawal</MenuItem>
            </Select>
          </FormControl>
        )}
      />
    )}
  </Stack>
);

export default EditForm;
