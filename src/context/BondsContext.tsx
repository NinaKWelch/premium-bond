'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getTransactions,
  getPrizes,
  addTransaction,
  addPrize,
  updateTransaction,
  deleteTransaction,
  updatePrize,
  deletePrize,
  calculate,
} from '#api/bonds';
import type {
  TTransaction,
  TPrize,
  TResults,
  TNewTransaction,
  TNewPrize,
  TPrizeFormValues,
} from '#types/bonds';
import { toYearMonth } from '#utils/date';
import BondsContext from './bondsContextDef';

export const BondsProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<TTransaction[]>([]);
  const [prizes, setPrizes] = useState<TPrize[]>([]);
  const [results, setResults] = useState<TResults | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingPrint, setPendingPrint] = useState(false);

  const showError = (err: unknown, fallback: string) =>
    setErrorMessage(err instanceof Error ? err.message : fallback);

  const clearError = () => setErrorMessage(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setTransactions(await getTransactions());
    } catch (err) {
      showError(err, 'Failed to fetch transactions');
    }
  }, []);

  const fetchPrizes = useCallback(async () => {
    try {
      setPrizes(await getPrizes());
    } catch (err) {
      showError(err, 'Failed to fetch prizes');
    }
  }, []);

  useEffect(() => {
    void fetchTransactions();
    void fetchPrizes();
  }, [fetchTransactions, fetchPrizes]);

  useEffect(() => {
    if (pendingPrint && results) {
      setPendingPrint(false);

      window.print();
    }
  }, [pendingPrint, results]);

  const handleTransactionSubmit = async (data: TNewTransaction) => {
    await addTransaction(data);

    void fetchTransactions();
    setResults(null);
  };

  const handleTransactionUpdate = async (id: string, data: TNewTransaction) => {
    try {
      await updateTransaction(id, data);

      void fetchTransactions();
      setResults(null);
    } catch (err) {
      showError(err, 'Failed to update transaction');
    }
  };

  const handleTransactionDelete = async (id: string) => {
    try {
      await deleteTransaction(id);

      void fetchTransactions();
      setResults(null);
    } catch (err) {
      showError(err, 'Failed to delete transaction');
    }
  };

  const handlePrizeSubmit = async ({ month, year, amount, reinvested }: TPrizeFormValues) => {
    const date = toYearMonth(year, month);
    try {
      await addPrize({ date, amount });
    } catch (err) {
      showError(err, 'Failed to add prize');
      return;
    }

    if (reinvested) {
      try {
        await addTransaction({ date, amount, type: 'reinvestment' });
      } catch (err) {
        showError(err, 'Prize saved but failed to add reinvestment transaction');
      }

      void fetchTransactions();
    }

    void fetchPrizes();
    setResults(null);
  };

  const handlePrizeUpdate = async (id: string, data: TNewPrize) => {
    try {
      await updatePrize(id, data);

      void fetchPrizes();
      setResults(null);
    } catch (err) {
      showError(err, 'Failed to update prize');
    }
  };

  const handlePrizeDelete = async (id: string) => {
    try {
      await deletePrize(id);

      void fetchPrizes();
      setResults(null);
    } catch (err) {
      showError(err, 'Failed to delete prize');
    }
  };

  const handleCalculate = async () => {
    setCalculating(true);
    try {
      setResults(await calculate());
    } catch (err) {
      showError(err, 'Failed to calculate');
    } finally {
      setCalculating(false);
    }
  };

  const handlePrint = async () => {
    if (results) {
      window.print();
    } else {
      await handleCalculate();

      setPendingPrint(true);
    }
  };

  return (
    <BondsContext.Provider
      value={{
        transactions,
        prizes,
        results,
        calculating,
        errorMessage,
        clearError,
        handleTransactionSubmit,
        handleTransactionUpdate,
        handleTransactionDelete,
        handlePrizeSubmit,
        handlePrizeUpdate,
        handlePrizeDelete,
        handleCalculate,
        handlePrint,
      }}
    >
      {children}
    </BondsContext.Provider>
  );
};
