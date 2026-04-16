import { z } from 'zod';
import {
  PREMIUM_BONDS_LAUNCH_YEAR,
  MIN_TRANSACTION_AMOUNT,
  MAX_TRANSACTION_AMOUNT,
  MIN_PRIZE_AMOUNT,
  MAX_PRIZE_AMOUNT,
} from '#constants';
import { currentYear } from '#utils/date';

const yearSchema = z
  .string()
  .min(1, 'Year is required')
  .refine(
    (v) => Number(v) >= PREMIUM_BONDS_LAUNCH_YEAR,
    `Year must be ${PREMIUM_BONDS_LAUNCH_YEAR} or later`,
  )
  .refine((v) => Number(v) <= currentYear(), `Year must be ${currentYear()} or earlier`);

export const transactionFormSchema = z.object({
  month: z.string().min(1, 'Month is required'),
  year: yearSchema,
  amount: z.coerce
    .number()
    .min(MIN_TRANSACTION_AMOUNT, `Amount must be at least £${MIN_TRANSACTION_AMOUNT}`)
    .max(MAX_TRANSACTION_AMOUNT, `Maximum holding is £${MAX_TRANSACTION_AMOUNT.toLocaleString()}`),
  type: z.enum(['deposit', 'withdrawal']),
});

export const prizeFormSchema = z.object({
  month: z.string().min(1, 'Month is required'),
  year: yearSchema,
  amount: z.coerce
    .number()
    .min(MIN_PRIZE_AMOUNT, `Minimum prize is £${MIN_PRIZE_AMOUNT}`)
    .max(MAX_PRIZE_AMOUNT, `Maximum prize is £${MAX_PRIZE_AMOUNT.toLocaleString()}`),
  reinvested: z.boolean(),
});

export const simpleFormSchema = z.object({
  firstInvestmentMonth: z.string().min(1, 'Month is required'),
  totalInvested: z.coerce.number().min(1, 'Must be at least £1'),
  totalPrizes: z.coerce.number().min(0, 'Cannot be negative'),
});
