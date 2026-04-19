import type { TTransaction, TPrize, TNewTransaction, TNewPrize, TResults } from '#types/bonds';

export type { TTransaction, TPrize, TNewTransaction, TNewPrize, TResults } from '#types/bonds';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE) {
  throw new Error(
    'NEXT_PUBLIC_API_BASE_URL is not set. Copy .env.local.example to .env.local and set the value.',
  );
}

type TErrorResponse = {
  error?: string;
};

const parseError = async (res: Response, fallback: string): Promise<string> => {
  try {
    const body = (await res.json()) as TErrorResponse;

    return body.error ?? fallback;
  } catch {
    return fallback;
  }
};

const authFetch = (url: string, token: string | null, init?: RequestInit): Promise<Response> => {
  if (!token) {
    return init ? fetch(url, init) : fetch(url);
  }

  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${token}`);

  return fetch(url, { ...init, headers });
};

export const getTransactions = async (token: string | null = null): Promise<TTransaction[]> => {
  const res = await authFetch(`${API_BASE}/transactions`, token);

  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to fetch transactions'));
  }

  return res.json() as Promise<TTransaction[]>;
};

export const getPrizes = async (token: string | null = null): Promise<TPrize[]> => {
  const res = await authFetch(`${API_BASE}/prizes`, token);

  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to fetch prizes'));
  }

  return res.json() as Promise<TPrize[]>;
};

export const addTransaction = async (
  token: string | null = null,
  data: TNewTransaction,
): Promise<void> => {
  const res = await authFetch(`${API_BASE}/transactions`, token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to add transaction'));
  }
};

export const addPrize = async (token: string | null = null, data: TNewPrize): Promise<void> => {
  const res = await authFetch(`${API_BASE}/prizes`, token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to add prize'));
  }
};

export const updateTransaction = async (
  token: string | null = null,
  id: string,
  data: TNewTransaction,
): Promise<void> => {
  const res = await authFetch(`${API_BASE}/transactions/${id}`, token, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to update transaction'));
  }
};

export const deleteTransaction = async (token: string | null = null, id: string): Promise<void> => {
  const res = await authFetch(`${API_BASE}/transactions/${id}`, token, { method: 'DELETE' });

  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to delete transaction'));
  }
};

export const updatePrize = async (
  token: string | null = null,
  id: string,
  data: TNewPrize,
): Promise<void> => {
  const res = await authFetch(`${API_BASE}/prizes/${id}`, token, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to update prize'));
  }
};

export const deletePrize = async (token: string | null = null, id: string): Promise<void> => {
  const res = await authFetch(`${API_BASE}/prizes/${id}`, token, { method: 'DELETE' });

  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to delete prize'));
  }
};

export const calculate = async (token: string | null = null): Promise<TResults> => {
  const res = await authFetch(`${API_BASE}/calculate`, token);

  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to calculate'));
  }

  return res.json() as Promise<TResults>;
};
