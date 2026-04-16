import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTransactions, getPrizes, addTransaction, addPrize, calculate } from '../bonds';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function okResponse(body: unknown) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
  } as Response);
}

function errorResponse(body: unknown, status = 400) {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve(body),
  } as Response);
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe('getTransactions', () => {
  it('returns transactions on success', async () => {
    const data = [{ id: '1', date: '2024-01-01', amount: 1000, type: 'deposit' }];
    mockFetch.mockReturnValue(okResponse(data));

    const result = await getTransactions();

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/bonds/transactions');
  });

  it('throws with the error message from the api on failure', async () => {
    mockFetch.mockReturnValue(errorResponse({ error: 'Something went wrong' }));

    await expect(getTransactions()).rejects.toThrow('Something went wrong');
  });

  it('throws a fallback message when the api returns no error field', async () => {
    mockFetch.mockReturnValue(errorResponse({}));

    await expect(getTransactions()).rejects.toThrow('Failed to fetch transactions');
  });
});

describe('getPrizes', () => {
  it('returns prizes on success', async () => {
    const data = [{ id: '1', date: '2024-03-01', amount: 25 }];
    mockFetch.mockReturnValue(okResponse(data));

    const result = await getPrizes();

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/bonds/prizes');
  });

  it('throws with the error message from the api on failure', async () => {
    mockFetch.mockReturnValue(errorResponse({ error: 'Something went wrong' }));

    await expect(getPrizes()).rejects.toThrow('Something went wrong');
  });
});

describe('addTransaction', () => {
  const newTransaction = { date: '2024-01-01', amount: 500, type: 'deposit' as const };

  it('posts to the transactions endpoint', async () => {
    mockFetch.mockReturnValue(okResponse({}));

    await addTransaction(newTransaction);

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/bonds/transactions',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      }),
    );
  });

  it('throws with the error message from the api on failure', async () => {
    mockFetch.mockReturnValue(errorResponse({ error: 'Withdrawal exceeds balance' }));

    await expect(addTransaction(newTransaction)).rejects.toThrow('Withdrawal exceeds balance');
  });
});

describe('addPrize', () => {
  const newPrize = { date: '2024-03-01', amount: 25 };

  it('posts to the prizes endpoint', async () => {
    mockFetch.mockReturnValue(okResponse({}));

    await addPrize(newPrize);

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/bonds/prizes',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrize),
      }),
    );
  });

  it('throws with the error message from the api on failure', async () => {
    mockFetch.mockReturnValue(
      errorResponse({ error: 'Prize date must be in a later month than the first deposit' }),
    );

    await expect(addPrize(newPrize)).rejects.toThrow(
      'Prize date must be in a later month than the first deposit',
    );
  });
});

describe('calculate', () => {
  it('returns results on success', async () => {
    const data = {
      byYear: [{ year: 2024, averageBalance: 1000, prizesWon: 25, effectiveRatePct: 2.5 }],
      overall: { totalInvested: 1000, totalPrizesWon: 25, averageAnnualRatePct: 2.5 },
    };
    mockFetch.mockReturnValue(okResponse(data));

    const result = await calculate();

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/bonds/calculate');
  });

  it('throws with the error message from the api on failure', async () => {
    mockFetch.mockReturnValue(errorResponse({ error: 'No deposits found' }));

    await expect(calculate()).rejects.toThrow('No deposits found');
  });
});
