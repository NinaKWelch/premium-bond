import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import type { TSimpleFormValues } from '#types/bonds';
import { simpleFormSchema } from '#schemas/bonds.schemas';

interface ISimpleCalculatorFormProps {
  defaultMonth: string
  onSubmit: (values: TSimpleFormValues) => void
  onChange: () => void
}

const SimpleCalculatorForm = ({ defaultMonth, onSubmit, onChange }: ISimpleCalculatorFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(simpleFormSchema),
    mode: 'onChange',
    defaultValues: { firstInvestmentMonth: defaultMonth },
  });

  const monthField = register('firstInvestmentMonth');

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ flexWrap: 'wrap', alignItems: { sm: 'flex-start' } }}
      >
        <TextField
          label="Month of first investment"
          type="month"
          slotProps={{ inputLabel: { shrink: true } }}
          error={!!errors.firstInvestmentMonth}
          helperText={errors.firstInvestmentMonth?.message}
          sx={{ flex: { sm: 1 } }}
          {...monthField}
          onChange={(e) => {
            onChange();
            void monthField.onChange(e);
          }}
        />

        <TextField
          label="Total invested (£)"
          type="number"
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
          error={!!errors.totalInvested}
          helperText={errors.totalInvested?.message}
          sx={{ flex: { sm: 1 } }}
          {...register('totalInvested')}
        />

        <TextField
          label="Total prizes won (£)"
          type="number"
          slotProps={{ htmlInput: { min: 0, step: 1 } }}
          error={!!errors.totalPrizes}
          helperText={errors.totalPrizes?.message}
          sx={{ flex: { sm: 1 } }}
          {...register('totalPrizes')}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={!isValid}
          sx={{ height: 56, fontSize: '1rem' }}
        >
          Calculate rate
        </Button>
      </Stack>
    </form>
  );
};

export default SimpleCalculatorForm;
