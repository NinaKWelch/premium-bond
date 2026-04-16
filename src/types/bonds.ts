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

export type TSimpleFormValues = {
  firstInvestmentMonth: string
  totalInvested: number
  totalPrizes: number
}

export type TSimpleResult = {
  years: number
  effectiveRatePct: number
}

export type TTransactionFormValues = {
  month: string
  year: string
  amount: number
  type: 'deposit' | 'withdrawal'
}

export type TPrizeFormValues = {
  month: string
  year: string
  amount: number
  reinvested: boolean
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
