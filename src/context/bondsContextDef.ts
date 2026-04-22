'use client';

import { createContext } from 'react';
import type {
  TNewTransaction,
  TNewPrize,
  TResults,
  TTransaction,
  TPrize,
  TPrizeFormValues,
} from '#types/bonds';

export interface IBondsContext {
  isGuest: boolean;
  transactions: TTransaction[];
  prizes: TPrize[];
  results: TResults | null;
  calculating: boolean;
  errorMessage: string | null;
  clearError: () => void;
  handleTransactionSubmit: (data: TNewTransaction) => Promise<void>;
  handleTransactionUpdate: (id: string, data: TNewTransaction) => Promise<void>;
  handleTransactionDelete: (id: string) => Promise<void>;
  handlePrizeSubmit: (data: TPrizeFormValues) => Promise<void>;
  handlePrizeUpdate: (
    id: string,
    data: TNewPrize,
    reinvested: boolean,
    existingReinvestmentId: string | null,
  ) => Promise<void>;
  handlePrizeDelete: (id: string) => Promise<void>;
  handleCalculate: () => Promise<void>;
  handlePrint: () => Promise<void>;
}

const BondsContext = createContext<IBondsContext | null>(null);

export default BondsContext;
