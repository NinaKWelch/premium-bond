import type { z } from 'zod';
import type {
  transactionFormSchema,
  prizeFormSchema,
  simpleFormSchema,
} from '#schemas/bonds.schemas';

export type TTransactionFormValues = z.infer<typeof transactionFormSchema>

export type TPrizeFormValues = z.infer<typeof prizeFormSchema>

export type TSimpleFormValues = z.infer<typeof simpleFormSchema>

export type TTransaction = {
  id: string
  date: string
  amount: number
  type: 'deposit' | 'withdrawal'
}

export type TPrize = {
  id: string
  date: string
  amount: number
}

export type TNewTransaction = Omit<TTransaction, 'id'>

export type TNewPrize = Omit<TPrize, 'id'>

export type TActivityItem =
  | (TTransaction & { itemType: 'transaction' })
  | (TPrize & { itemType: 'prize' })

export type TSimpleResult = {
  years: number
  effectiveRatePct: number
}

export type TYearResult = {
  year: number
  amountInvested: number
  averageBalance: number
  prizesWon: number
  effectiveRatePct: number
}

export type TResults = {
  byYear: TYearResult[]
  overall: {
    totalInvested: number
    totalPrizesWon: number
    averageAnnualRatePct: number
  }
}
