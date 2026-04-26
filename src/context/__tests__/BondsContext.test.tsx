// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { BondsProvider } from '../BondsContext';
import useBonds from '../useBonds';

// Mock NextAuth — tests exercise the authenticated (API) path
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { backendToken: 'test-token', user: { email: 'test@test.com' } },
    status: 'authenticated',
  }),
}));

vi.mock('../../api/bonds', () => ({
  getTransactions: vi.fn(),
  getPrizes: vi.fn(),
  addTransaction: vi.fn(),
  addPrize: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  updatePrize: vi.fn(),
  deletePrize: vi.fn(),
  calculate: vi.fn(),
}));

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

const mockGetTransactions = vi.mocked(getTransactions);
const mockGetPrizes = vi.mocked(getPrizes);
const mockAddTransaction = vi.mocked(addTransaction);
const mockAddPrize = vi.mocked(addPrize);
const mockUpdateTransaction = vi.mocked(updateTransaction);
const mockDeleteTransaction = vi.mocked(deleteTransaction);
const mockUpdatePrize = vi.mocked(updatePrize);
const mockDeletePrize = vi.mocked(deletePrize);
const mockCalculate = vi.mocked(calculate);

const TOKEN = 'test-token';

const TRANSACTIONS = [{ id: '1', date: '2024-01', amount: 1000, type: 'deposit' as const }];
const PRIZES = [{ id: '2', date: '2024-03', amount: 25 }];
const RESULTS = {
  byYear: [
    {
      year: 2024,
      amountInvested: 1000,
      averageBalance: 958,
      prizesWon: 25,
      effectiveRatePct: 2.61,
    },
  ],
  overall: {
    totalInvested: 1000,
    cashDeposited: 1000,
    totalPrizesWon: 25,
    averageAnnualRatePct: 2.61,
  },
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BondsProvider>{children}</BondsProvider>
);

describe('BondsProvider()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTransactions.mockResolvedValue(TRANSACTIONS);
    mockGetPrizes.mockResolvedValue(PRIZES);
    mockAddTransaction.mockResolvedValue(undefined);
    mockAddPrize.mockResolvedValue(undefined);
    mockUpdateTransaction.mockResolvedValue(undefined);
    mockDeleteTransaction.mockResolvedValue(undefined);
    mockUpdatePrize.mockResolvedValue(undefined);
    mockDeletePrize.mockResolvedValue(undefined);
    mockCalculate.mockResolvedValue(RESULTS);
  });

  describe('initial state', () => {
    it('fetches transactions and prizes on mount', async () => {
      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      expect(result.current.transactions).toEqual(TRANSACTIONS);
      expect(result.current.prizes).toEqual(PRIZES);
    });

    it('starts with no results, no error, and not calculating', async () => {
      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      expect(result.current.results).toBeNull();
      expect(result.current.errorMessage).toBeNull();
      expect(result.current.calculating).toBe(false);
    });

    it('sets errorMessage when fetching transactions fails', async () => {
      mockGetTransactions.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      expect(result.current.errorMessage).toBe('Network error');
    });

    it('sets errorMessage when fetching prizes fails', async () => {
      mockGetPrizes.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      expect(result.current.errorMessage).toBe('Network error');
    });
  });

  describe('clearError()', () => {
    it('clears the errorMessage', async () => {
      mockGetTransactions.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});
      expect(result.current.errorMessage).toBe('Network error');

      act(() => result.current.clearError());

      expect(result.current.errorMessage).toBeNull();
    });
  });

  describe('handleTransactionSubmit()', () => {
    it('calls addTransaction and refreshes the list', async () => {
      const { result } = renderHook(() => useBonds(), { wrapper });
      await act(async () => {});

      const newTransaction = { date: '2024-06', amount: 500, type: 'deposit' as const };
      await act(async () => {
        await result.current.handleTransactionSubmit(newTransaction);
      });

      expect(mockAddTransaction).toHaveBeenCalledWith(TOKEN, newTransaction);
      expect(mockGetTransactions).toHaveBeenCalledTimes(2); // mount + after submit
    });

    it('clears results after submit', async () => {
      mockCalculate.mockResolvedValue(RESULTS);
      const { result } = renderHook(() => useBonds(), { wrapper });
      await act(async () => {});
      await act(async () => {
        await result.current.handleCalculate();
      });

      expect(result.current.results).toEqual(RESULTS);

      await act(async () => {
        await result.current.handleTransactionSubmit({
          date: '2024-06',
          amount: 500,
          type: 'deposit',
        });
      });

      expect(result.current.results).toBeNull();
    });
  });

  describe('handleTransactionUpdate()', () => {
    it('calls updateTransaction and refreshes the list', async () => {
      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      const updated = { date: '2024-06', amount: 600, type: 'deposit' as const };

      await act(async () => {
        await result.current.handleTransactionUpdate('1', updated);
      });

      expect(mockUpdateTransaction).toHaveBeenCalledWith(TOKEN, '1', updated);
      expect(mockGetTransactions).toHaveBeenCalledTimes(2);
    });

    it('sets errorMessage when update fails', async () => {
      mockUpdateTransaction.mockRejectedValue(new Error('Not found'));

      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handleTransactionUpdate('1', {
          date: '2024-06',
          amount: 600,
          type: 'deposit',
        });
      });

      expect(result.current.errorMessage).toBe('Not found');
    });
  });

  describe('handleTransactionDelete()', () => {
    it('calls deleteTransaction and refreshes the list', async () => {
      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handleTransactionDelete('1');
      });

      expect(mockDeleteTransaction).toHaveBeenCalledWith(TOKEN, '1');
      expect(mockGetTransactions).toHaveBeenCalledTimes(2);
    });

    it('propagates error to the caller when delete fails', async () => {
      mockDeleteTransaction.mockRejectedValue(new Error('Cannot delete'));

      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await expect(
        act(async () => {
          await result.current.handleTransactionDelete('1');
        }),
      ).rejects.toThrow('Cannot delete');
    });
  });

  describe('handlePrizeSubmit()', () => {
    it('calls addPrize and refreshes prizes', async () => {
      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handlePrizeSubmit({
          month: '03',
          year: '2024',
          amount: 25,
          reinvested: false,
        });
      });

      expect(mockAddPrize).toHaveBeenCalledWith(TOKEN, { date: '2024-03', amount: 25 });
      expect(mockGetPrizes).toHaveBeenCalledTimes(2);
    });

    it('also adds a deposit transaction when reinvested is true', async () => {
      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handlePrizeSubmit({
          month: '03',
          year: '2024',
          amount: 25,
          reinvested: true,
        });
      });

      expect(mockAddTransaction).toHaveBeenCalledWith(TOKEN, {
        date: '2024-03',
        amount: 25,
        type: 'reinvestment',
      });
      expect(mockGetTransactions).toHaveBeenCalledTimes(2);
    });

    it('sets errorMessage and stops when addPrize fails', async () => {
      mockAddPrize.mockRejectedValue(new Error('No deposits found'));

      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handlePrizeSubmit({
          month: '03',
          year: '2024',
          amount: 25,
          reinvested: false,
        });
      });

      expect(result.current.errorMessage).toBe('No deposits found');
      expect(mockGetPrizes).toHaveBeenCalledTimes(1); // only the initial fetch, not refreshed
    });

    it('sets a specific errorMessage when reinvestment deposit fails but prize was saved', async () => {
      // Reject with a non-Error so showError uses the fallback string, not err.message
      mockAddTransaction.mockRejectedValue('server error');

      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handlePrizeSubmit({
          month: '03',
          year: '2024',
          amount: 25,
          reinvested: true,
        });
      });

      expect(result.current.errorMessage).toBe(
        'Prize saved but failed to add reinvestment transaction',
      );
    });
  });

  describe('handlePrizeUpdate()', () => {
    const prizeData = { date: '2024-04', amount: 50 };

    it('calls updatePrize and refreshes prizes', async () => {
      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handlePrizeUpdate('2', prizeData, false, null);
      });

      expect(mockUpdatePrize).toHaveBeenCalledWith(TOKEN, '2', prizeData);
      expect(mockGetPrizes).toHaveBeenCalledTimes(2);
    });

    it('sets errorMessage when update fails', async () => {
      mockUpdatePrize.mockRejectedValue(new Error('Not found'));

      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handlePrizeUpdate('2', prizeData, false, null);
      });

      expect(result.current.errorMessage).toBe('Not found');
    });

    it('updates the existing reinvestment transaction when reinvested stays true', async () => {
      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handlePrizeUpdate('2', prizeData, true, 'reinvest-1');
      });

      expect(mockUpdateTransaction).toHaveBeenCalledWith(TOKEN, 'reinvest-1', {
        date: prizeData.date,
        amount: prizeData.amount,
        type: 'reinvestment',
      });
      expect(mockGetTransactions).toHaveBeenCalledTimes(2);
    });

    it('adds a new reinvestment transaction when reinvested is newly checked', async () => {
      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handlePrizeUpdate('2', prizeData, true, null);
      });

      expect(mockAddTransaction).toHaveBeenCalledWith(TOKEN, {
        date: prizeData.date,
        amount: prizeData.amount,
        type: 'reinvestment',
      });
    });

    it('deletes the reinvestment transaction when reinvested is unchecked', async () => {
      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handlePrizeUpdate('2', prizeData, false, 'reinvest-1');
      });

      expect(mockDeleteTransaction).toHaveBeenCalledWith(TOKEN, 'reinvest-1');
    });

    it('sets errorMessage when updating the linked reinvestment fails', async () => {
      mockUpdateTransaction.mockRejectedValue(new Error('Mock error'));

      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handlePrizeUpdate('2', prizeData, true, 'reinvest-1');
      });

      expect(result.current.errorMessage).toBe('Mock error');
    });
  });

  describe('handlePrizeDelete()', () => {
    it('calls deletePrize and refreshes prizes', async () => {
      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handlePrizeDelete('2');
      });

      expect(mockDeletePrize).toHaveBeenCalledWith(TOKEN, '2');
      expect(mockGetPrizes).toHaveBeenCalledTimes(2);
    });

    it('propagates error to the caller when delete fails', async () => {
      mockDeletePrize.mockRejectedValue(new Error('Cannot delete'));

      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await expect(
        act(async () => {
          await result.current.handlePrizeDelete('2');
        }),
      ).rejects.toThrow('Cannot delete');
    });
  });

  describe('handleClearAll()', () => {
    it('deletes all items and clears state on success', async () => {
      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handleCalculate();
      });

      await act(async () => {
        await result.current.handleClearAll();
      });

      expect(mockDeleteTransaction).toHaveBeenCalledWith(TOKEN, '1');
      expect(mockDeletePrize).toHaveBeenCalledWith(TOKEN, '2');
      expect(result.current.transactions).toEqual([]);
      expect(result.current.prizes).toEqual([]);
      expect(result.current.results).toBeNull();
    });

    it('sets errorMessage and does not clear state when a delete fails', async () => {
      mockDeleteTransaction.mockRejectedValue(new Error('Server error'));

      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handleClearAll();
      });

      expect(result.current.errorMessage).toBe('1 item(s) could not be deleted. Please try again.');
      expect(result.current.transactions).toEqual(TRANSACTIONS);
      expect(result.current.prizes).toEqual(PRIZES);
    });

    it('reports the correct count when multiple deletes fail', async () => {
      mockDeleteTransaction.mockRejectedValue(new Error('Server error'));
      mockDeletePrize.mockRejectedValue(new Error('Server error'));

      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handleClearAll();
      });

      expect(result.current.errorMessage).toBe('2 item(s) could not be deleted. Please try again.');
    });
  });

  describe('handleCalculate()', () => {
    it('sets results on success', async () => {
      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handleCalculate();
      });

      expect(result.current.results).toEqual(RESULTS);
    });

    it('sets calculating to false after completion', async () => {
      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handleCalculate();
      });

      expect(result.current.calculating).toBe(false);
    });

    it('sets errorMessage and stops calculating when calculate fails', async () => {
      mockCalculate.mockRejectedValue(new Error('No deposits found'));

      const { result } = renderHook(() => useBonds(), { wrapper });

      await act(async () => {});

      await act(async () => {
        await result.current.handleCalculate();
      });

      expect(result.current.errorMessage).toBe('No deposits found');
      expect(result.current.calculating).toBe(false);
      expect(result.current.results).toBeNull();
    });
  });

  describe('useBonds()', () => {
    it('throws when used outside BondsProvider', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});

      let caughtError: unknown;

      try {
        renderHook(() => useBonds());
      } catch (e) {
        caughtError = e;
      }

      vi.restoreAllMocks();

      expect(caughtError).toBeInstanceOf(Error);
      expect((caughtError as Error).message).toBe('useBonds must be used within BondsProvider');
    });
  });
});
