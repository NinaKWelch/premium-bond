import { z } from 'zod';
import {
  PREMIUM_BONDS_LAUNCH_DATE,
  MIN_TRANSACTION_AMOUNT,
  MAX_TRANSACTION_AMOUNT,
  MIN_PRIZE_AMOUNT,
  MAX_PRIZE_AMOUNT,
} from '#constants';
import { currentMonth } from '#utils/date';

const yearSchema = z.string().min(1, 'Year is required');

const futureMonthRefinement = (data: { month: string; year: string }, ctx: z.RefinementCtx) => {
  if (data.month && data.year) {
    const selected = `${data.year}-${data.month}`;
    if (selected > currentMonth()) {
      ctx.addIssue({ code: 'custom', path: ['month'], message: 'Date cannot be in the future' });
    }
  }
};

const baseTransactionSchema = z.object({
  month: z.string().min(1, 'Month is required'),
  year: yearSchema,
  amount: z.coerce
    .number()
    .min(MIN_TRANSACTION_AMOUNT, `Amount must be at least £${MIN_TRANSACTION_AMOUNT}`)
    .max(MAX_TRANSACTION_AMOUNT, `Maximum holding is £${MAX_TRANSACTION_AMOUNT.toLocaleString()}`),
  type: z.enum(['deposit', 'withdrawal']),
});

// Static export used for type inference only
export const transactionFormSchema = baseTransactionSchema.superRefine(futureMonthRefinement);

// Factory used by the form — includes balance-aware withdrawal check
export const createTransactionFormSchema = (balance: number) =>
  baseTransactionSchema.superRefine((data, ctx) => {
    futureMonthRefinement(data, ctx);
    if (data.type === 'withdrawal' && data.amount > balance) {
      ctx.addIssue({
        code: 'custom',
        path: ['amount'],
        message: 'You cannot withdraw more than you have deposited before this date',
      });
    }
  });

export const prizeFormSchema = z
  .object({
    month: z.string().min(1, 'Month is required'),
    year: yearSchema,
    amount: z.coerce
      .number()
      .min(MIN_PRIZE_AMOUNT, `Minimum prize is £${MIN_PRIZE_AMOUNT}`)
      .max(MAX_PRIZE_AMOUNT, `Maximum prize is £${MAX_PRIZE_AMOUNT.toLocaleString()}`),
    reinvested: z.boolean(),
  })
  .superRefine(futureMonthRefinement);

export const simpleFormSchema = z
  .object({
    firstInvestmentMonth: z
      .string()
      .min(1, 'Month is required')
      .refine(
        (v) => v >= PREMIUM_BONDS_LAUNCH_DATE,
        `Month cannot be before ${PREMIUM_BONDS_LAUNCH_DATE.replace('-', '/')}`,
      )
      .refine((v) => v <= currentMonth(), 'Month cannot be in the future'),
    totalInvested: z.coerce.number().min(25, 'Must be at least £25'),
    totalPrizes: z.coerce
      .number()
      .min(0, 'Cannot be negative')
      .refine(
        (v) => v === 0 || v >= MIN_PRIZE_AMOUNT,
        `Must be 0 or at least £${MIN_PRIZE_AMOUNT}`,
      ),
  })
  .superRefine((data, ctx) => {
    if (data.firstInvestmentMonth === currentMonth() && data.totalPrizes > 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['totalPrizes'],
        message:
          'Bonds do not enter the draw until the month after purchase — prizes cannot be won in the first month',
      });
    }
  });
