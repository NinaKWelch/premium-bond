import { useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import type { TSimpleFormValues } from '../../types/bonds'

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
  } = useForm<TSimpleFormValues>({
    mode: 'onChange',
    defaultValues: { firstInvestmentMonth: defaultMonth },
  })

  const monthField = register('firstInvestmentMonth', { required: 'Month is required' })

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
            onChange()
            monthField.onChange(e)
          }}
        />

        <TextField
          label="Total invested (£)"
          type="number"
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
          error={!!errors.totalInvested}
          helperText={errors.totalInvested?.message}
          sx={{ flex: { sm: 1 } }}
          {...register('totalInvested', {
            required: 'Total invested is required',
            valueAsNumber: true,
            min: { value: 1, message: 'Must be at least £1' },
          })}
        />

        <TextField
          label="Total prizes won (£)"
          type="number"
          slotProps={{ htmlInput: { min: 0, step: 1 } }}
          error={!!errors.totalPrizes}
          helperText={errors.totalPrizes?.message}
          sx={{ flex: { sm: 1 } }}
          {...register('totalPrizes', {
            required: 'Total prizes is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Cannot be negative' },
          })}
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
  )
}

export default SimpleCalculatorForm
