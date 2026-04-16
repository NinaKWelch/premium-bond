import type { TTransaction, TPrize, TNewTransaction, TNewPrize, TResults } from '#types/bonds';

export type { TTransaction, TPrize, TNewTransaction, TNewPrize, TResults } from '#types/bonds';

const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (!API_BASE) {
  throw new Error('VITE_API_BASE_URL is not set. Copy .env.example to .env and set the value.');
}

const parseError = async (res: Response, fallback: string): Promise<string> => {
  try {
    const body = (await res.json()) as { error?: string };
    return body.error ?? fallback;
  } catch {
    return fallback;
  }
};

export const getTransactions = async (): Promise<TTransaction[]> => {
  const res = await fetch(`${API_BASE}/transactions`);
  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to fetch transactions'));
  }
  return res.json() as Promise<TTransaction[]>;
};

export const getPrizes = async (): Promise<TPrize[]> => {
  const res = await fetch(`${API_BASE}/prizes`);
  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to fetch prizes'));
  }
  return res.json() as Promise<TPrize[]>;
};

export const addTransaction = async (data: TNewTransaction): Promise<void> => {
  const res = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to add transaction'));
  }
};

export const addPrize = async (data: TNewPrize): Promise<void> => {
  const res = await fetch(`${API_BASE}/prizes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to add prize'));
  }
};

export const updateTransaction = async (id: string, data: TNewTransaction): Promise<void> => {
  const res = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to update transaction'));
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/transactions/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to delete transaction'));
  }
};

export const updatePrize = async (id: string, data: TNewPrize): Promise<void> => {
  const res = await fetch(`${API_BASE}/prizes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to update prize'));
  }
};

export const deletePrize = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/prizes/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to delete prize'));
  }
};

export const calculate = async (): Promise<TResults> => {
  const res = await fetch(`${API_BASE}/calculate`);
  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to calculate'));
  }
  return res.json() as Promise<TResults>;
};
