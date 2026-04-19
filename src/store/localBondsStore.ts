import type { TTransaction, TNewTransaction, TPrize, TNewPrize, TResults } from '#types/bonds';
import { calculateLocal } from '#utils/calculate';

const TXN_KEY = 'pb_transactions';
const PRIZE_KEY = 'pb_prizes';

export const readJson = <T>(key: string): T[] => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]') as T[];
  } catch {
    return [];
  }
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const writeJson = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const newId = () => crypto.randomUUID();

export const localBondsStore = {
  getTransactions: (): TTransaction[] => readJson<TTransaction>(TXN_KEY),

  addTransaction: (data: TNewTransaction): TTransaction => {
    const item: TTransaction = { id: newId(), ...data };
    const list = readJson<TTransaction>(TXN_KEY);

    writeJson(TXN_KEY, [...list, item]);

    return item;
  },

  updateTransaction: (id: string, data: TNewTransaction): TTransaction | null => {
    const list = readJson<TTransaction>(TXN_KEY);
    const idx = list.findIndex((t) => t.id === id);

    if (idx === -1) {
      return null;
    }

    const updated = { id, ...data };

    list[idx] = updated;

    writeJson(TXN_KEY, list);
    return updated;
  },

  deleteTransaction: (id: string): void => {
    const list = readJson<TTransaction>(TXN_KEY);
    const target = list.find((t) => t.id === id);

    if (!target) {
      throw new Error('Transaction not found');
    }

    const parseYM = (ym: string) => {
      const [y, m] = ym.split('-').map(Number);

      return new Date(y, m - 1, 1);
    };

    const remaining = list.filter((t) => t.id !== id).map((t) => ({ ...t, date: parseYM(t.date) }));
    const runningBalance = [...remaining].sort((a, b) => a.date.getTime() - b.date.getTime());
    let balance = 0;

    for (const t of runningBalance) {
      balance += t.type === 'deposit' || t.type === 'reinvestment' ? t.amount : -t.amount;

      if (balance < 0) {
        throw new Error(
          'This transaction cannot be deleted — a withdrawal depends on it. Delete the withdrawal first.',
        );
      }
    }

    if (target.type === 'deposit') {
      const prizes = readJson<TPrize>(PRIZE_KEY);
      const newFirstDeposit = remaining
        .filter((t) => t.type === 'deposit')
        .sort((a, b) => a.date.getTime() - b.date.getTime())[0] as
        | (typeof remaining)[0]
        | undefined;

      const hasOrphanedPrize = prizes.some((p) => {
        const prizeDate = parseYM(p.date);
        const prizeYM = prizeDate.getFullYear() * 12 + prizeDate.getMonth();
        const depositYM = newFirstDeposit
          ? newFirstDeposit.date.getFullYear() * 12 + newFirstDeposit.date.getMonth()
          : Infinity;

        return prizeYM <= depositYM;
      });

      if (hasOrphanedPrize) {
        throw new Error(
          'This deposit cannot be deleted — prizes exist that depend on it. Delete those prizes first.',
        );
      }
    }

    writeJson(
      TXN_KEY,
      list.filter((t) => t.id !== id),
    );
  },

  getPrizes: (): TPrize[] => readJson<TPrize>(PRIZE_KEY),

  addPrize: (data: TNewPrize): TPrize => {
    const item: TPrize = { id: newId(), ...data };
    const list = readJson<TPrize>(PRIZE_KEY);

    writeJson(PRIZE_KEY, [...list, item]);

    return item;
  },

  updatePrize: (id: string, data: TNewPrize): TPrize | null => {
    const list = readJson<TPrize>(PRIZE_KEY);
    const idx = list.findIndex((p) => p.id === id);

    if (idx === -1) {
      return null;
    }

    const updated = { id, ...data };

    list[idx] = updated;

    writeJson(PRIZE_KEY, list);
    return updated;
  },

  deletePrize: (id: string): boolean => {
    const list = readJson<TPrize>(PRIZE_KEY);
    const filtered = list.filter((p) => p.id !== id);

    if (filtered.length === list.length) {
      return false;
    }

    writeJson(PRIZE_KEY, filtered);
    return true;
  },

  calculate: (): TResults => {
    const transactions = readJson<TTransaction>(TXN_KEY);
    const prizes = readJson<TPrize>(PRIZE_KEY);

    return calculateLocal(transactions, prizes);
  },

  clear: () => {
    localStorage.removeItem(TXN_KEY);
    localStorage.removeItem(PRIZE_KEY);
  },
};
