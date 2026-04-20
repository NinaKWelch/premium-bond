'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
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
import { localBondsStore } from '#store/localBondsStore';
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
  const { data: session, status } = useSession();
  const token = session?.backendToken ?? null;
  const isGuest = status === 'unauthenticated';

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
      const data = isGuest ? localBondsStore.getTransactions() : await getTransactions(token);
      setTransactions(data);
    } catch (err) {
      showError(err, 'Failed to fetch transactions');
    }
  }, [isGuest, token]);

  const fetchPrizes = useCallback(async () => {
    try {
      const data = isGuest ? localBondsStore.getPrizes() : await getPrizes(token);
      setPrizes(data);
    } catch (err) {
      showError(err, 'Failed to fetch prizes');
    }
  }, [isGuest, token]);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    void fetchTransactions();
    void fetchPrizes();
  }, [status, fetchTransactions, fetchPrizes]);

  useEffect(() => {
    if (pendingPrint && results) {
      setPendingPrint(false);
      window.print();
    }
  }, [pendingPrint, results]);

  const handleTransactionSubmit = async (data: TNewTransaction) => {
    if (isGuest) {
      localBondsStore.addTransaction(data);
    } else {
      await addTransaction(token, data);
    }
    void fetchTransactions();
    setResults(null);
  };

  const handleTransactionUpdate = async (id: string, data: TNewTransaction) => {
    try {
      if (isGuest) {
        localBondsStore.updateTransaction(id, data);
      } else {
        await updateTransaction(token, id, data);
      }

      void fetchTransactions();
      setResults(null);
    } catch (err) {
      showError(err, 'Failed to update transaction');
    }
  };

  const handleTransactionDelete = async (id: string) => {
    if (isGuest) {
      localBondsStore.deleteTransaction(id);
    } else {
      await deleteTransaction(token, id);
    }

    void fetchTransactions();
    setResults(null);
  };

  const handlePrizeSubmit = async ({ month, year, amount, reinvested }: TPrizeFormValues) => {
    const date = toYearMonth(year, month);
    try {
      if (isGuest) {
        localBondsStore.addPrize({ date, amount });
      } else {
        await addPrize(token, { date, amount });
      }
    } catch (err) {
      showError(err, 'Failed to add prize');
      return;
    }

    if (reinvested) {
      try {
        if (isGuest) {
          localBondsStore.addTransaction({ date, amount, type: 'reinvestment' });
        } else {
          await addTransaction(token, { date, amount, type: 'reinvestment' });
        }

        void fetchTransactions();
      } catch (err) {
        showError(err, 'Prize saved but failed to add reinvestment transaction');
      }
    }

    void fetchPrizes();
    setResults(null);
  };

  const handlePrizeUpdate = async (id: string, data: TNewPrize) => {
    try {
      if (isGuest) {
        localBondsStore.updatePrize(id, data);
      } else {
        await updatePrize(token, id, data);
      }

      void fetchPrizes();
      setResults(null);
    } catch (err) {
      showError(err, 'Failed to update prize');
    }
  };

  const handlePrizeDelete = async (id: string) => {
    if (isGuest) {
      localBondsStore.deletePrize(id);
    } else {
      await deletePrize(token, id);
    }

    void fetchPrizes();
    setResults(null);
  };

  const handleCalculate = async () => {
    setCalculating(true);
    try {
      const data = isGuest ? localBondsStore.calculate() : await calculate(token);
      setResults(data);
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
        isGuest,
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
