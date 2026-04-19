import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  API_BASE,
  getTransactions,
  getPrizes,
  addTransaction,
  addPrize,
  calculate,
} from '../bonds';

const okResponse = (body: unknown) => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
  } as Response);
};

const errorResponse = (body: unknown, status = 400) => {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve(body),
  } as Response);
};

describe('bonds api', () => {
  const mockErrorMessage = 'Something went wrong';
  const mockError = { error: mockErrorMessage };
  const mockFetch = vi.fn();

  vi.stubGlobal('fetch', mockFetch);

  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('getTransactions', () => {
    it('returns transactions on success', async () => {
      const mockData = [{ id: '1', date: '2024-01-01', amount: 1000, type: 'deposit' }];

      mockFetch.mockReturnValue(okResponse(mockData));

      const result = await getTransactions();

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/transactions`);
    });

    it('throws with the error message from the api on failure', async () => {
      mockFetch.mockReturnValue(errorResponse(mockError));

      await expect(getTransactions()).rejects.toThrow(mockErrorMessage);
    });

    it('throws a fallback message when the api returns no error field', async () => {
      mockFetch.mockReturnValue(errorResponse({}));

      await expect(getTransactions()).rejects.toThrow('Failed to fetch transactions');
    });
  });

  describe('getPrizes', () => {
    it('returns prizes on success', async () => {
      const mockData = [{ id: '1', date: '2024-03-01', amount: 25 }];

      mockFetch.mockReturnValue(okResponse(mockData));

      const result = await getPrizes();

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/prizes`);
    });

    it('throws with the error message from the api on failure', async () => {
      mockFetch.mockReturnValue(errorResponse(mockError));

      await expect(getPrizes()).rejects.toThrow(mockErrorMessage);
    });
  });

  describe('addTransaction', () => {
    const mockNewTransaction = { date: '2024-01-01', amount: 500, type: 'deposit' as const };

    it('posts to the transactions endpoint', async () => {
      mockFetch.mockReturnValue(okResponse({}));

      await addTransaction(null, mockNewTransaction);

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE}/transactions`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockNewTransaction),
        }),
      );
    });

    it('throws with the error message from the api on failure', async () => {
      mockFetch.mockReturnValue(errorResponse(mockError));

      await expect(addTransaction(null, mockNewTransaction)).rejects.toThrow(mockErrorMessage);
    });
  });

  describe('addPrize', () => {
    const mockNewPrize = { date: '2024-03-01', amount: 25 };

    it('posts to the prizes endpoint', async () => {
      mockFetch.mockReturnValue(okResponse({}));

      await addPrize(null, mockNewPrize);

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE}/prizes`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockNewPrize),
        }),
      );
    });

    it('throws with the error message from the api on failure', async () => {
      mockFetch.mockReturnValue(
        errorResponse({ error: 'Prize date must be in a later month than the first deposit' }),
      );

      await expect(addPrize(null, mockNewPrize)).rejects.toThrow(
        'Prize date must be in a later month than the first deposit',
      );
    });
  });

  describe('calculate', () => {
    it('returns results on success', async () => {
      const mockData = {
        byYear: [{ year: 2024, averageBalance: 1000, prizesWon: 25, effectiveRatePct: 2.5 }],
        overall: { totalInvested: 1000, totalPrizesWon: 25, averageAnnualRatePct: 2.5 },
      };

      mockFetch.mockReturnValue(okResponse(mockData));

      const result = await calculate();

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/calculate`);
    });

    it('throws with the error message from the api on failure', async () => {
      mockFetch.mockReturnValue(errorResponse(mockError));

      await expect(calculate()).rejects.toThrow(mockErrorMessage);
    });
  });
});
