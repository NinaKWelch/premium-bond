// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { localBondsStore, readJson, writeJson, newId } from '../localBondsStore';

const TEST_KEY = '__test__';

describe('readJson()', () => {
  afterEach(() => localStorage.removeItem(TEST_KEY));

  it('returns an empty array when the key does not exist', () => {
    expect(readJson(TEST_KEY)).toEqual([]);
  });

  it('parses and returns stored JSON', () => {
    localStorage.setItem(TEST_KEY, JSON.stringify([{ id: '1' }]));
    expect(readJson(TEST_KEY)).toEqual([{ id: '1' }]);
  });

  it('returns an empty array when the stored value is invalid JSON', () => {
    localStorage.setItem(TEST_KEY, 'not-json');
    expect(readJson(TEST_KEY)).toEqual([]);
  });
});

describe('writeJson()', () => {
  afterEach(() => localStorage.removeItem(TEST_KEY));

  it('serializes the array and stores it under the given key', () => {
    writeJson(TEST_KEY, [{ id: '1', value: 42 }]);
    expect(localStorage.getItem(TEST_KEY)).toBe('[{"id":"1","value":42}]');
  });

  it('overwrites any previously stored value', () => {
    writeJson(TEST_KEY, [{ id: '1' }]);
    writeJson(TEST_KEY, [{ id: '2' }]);
    expect(readJson(TEST_KEY)).toEqual([{ id: '2' }]);
  });
});

describe('newId()', () => {
  it('returns a string', () => {
    expect(typeof newId()).toBe('string');
  });

  it('returns a UUID-shaped value', () => {
    expect(newId()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it('returns a unique value on each call', () => {
    expect(newId()).not.toBe(newId());
  });
});

describe('localBondsStore', () => {
  beforeEach(() => localBondsStore.clear());

  describe('getTransactions', () => {
    it('returns an empty array when storage is empty', () => {
      expect(localBondsStore.getTransactions()).toEqual([]);
    });
  });

  describe('addTransaction', () => {
    it('persists and returns the new transaction with an id', () => {
      const result = localBondsStore.addTransaction({
        date: '2023-01',
        amount: 1000,
        type: 'deposit',
      });

      expect(result).toMatchObject({ date: '2023-01', amount: 1000, type: 'deposit' });
      expect(result.id).toBeDefined();
    });

    it('accumulates multiple transactions', () => {
      localBondsStore.addTransaction({ date: '2023-01', amount: 1000, type: 'deposit' });
      localBondsStore.addTransaction({ date: '2023-06', amount: 500, type: 'deposit' });

      expect(localBondsStore.getTransactions()).toHaveLength(2);
    });
  });

  describe('updateTransaction', () => {
    it('updates and returns the modified transaction', () => {
      const { id } = localBondsStore.addTransaction({
        date: '2023-01',
        amount: 1000,
        type: 'deposit',
      });
      const result = localBondsStore.updateTransaction(id, {
        date: '2023-03',
        amount: 2000,
        type: 'deposit',
      });

      expect(result).toMatchObject({ id, date: '2023-03', amount: 2000 });
      expect(localBondsStore.getTransactions()[0]).toMatchObject({ amount: 2000 });
    });

    it('returns null when the id does not exist', () => {
      expect(
        localBondsStore.updateTransaction('bad-id', {
          date: '2023-01',
          amount: 1000,
          type: 'deposit',
        }),
      ).toBeNull();
    });
  });

  describe('deleteTransaction', () => {
    it('removes the transaction from storage', () => {
      const { id } = localBondsStore.addTransaction({
        date: '2023-01',
        amount: 1000,
        type: 'deposit',
      });
      localBondsStore.deleteTransaction(id);

      expect(localBondsStore.getTransactions()).toHaveLength(0);
    });

    it('throws when the transaction does not exist', () => {
      expect(() => localBondsStore.deleteTransaction('bad-id')).toThrow('Transaction not found');
    });

    it('throws when deleting a deposit would leave the balance negative', () => {
      const { id } = localBondsStore.addTransaction({
        date: '2023-01',
        amount: 500,
        type: 'deposit',
      });
      localBondsStore.addTransaction({ date: '2023-06', amount: 500, type: 'withdrawal' });

      expect(() => localBondsStore.deleteTransaction(id)).toThrow(/withdrawal/i);
    });

    it('throws when deleting the only deposit would orphan prizes', () => {
      const { id } = localBondsStore.addTransaction({
        date: '2023-01',
        amount: 1000,
        type: 'deposit',
      });
      localBondsStore.addPrize({ date: '2023-06', amount: 25 });

      expect(() => localBondsStore.deleteTransaction(id)).toThrow(/prizes/i);
    });

    it('allows deleting a deposit when a later deposit still covers existing prizes', () => {
      const { id } = localBondsStore.addTransaction({
        date: '2023-01',
        amount: 1000,
        type: 'deposit',
      });
      localBondsStore.addTransaction({ date: '2023-03', amount: 1000, type: 'deposit' });
      localBondsStore.addPrize({ date: '2023-06', amount: 25 });

      expect(() => localBondsStore.deleteTransaction(id)).not.toThrow();
    });

    it('allows deleting a withdrawal', () => {
      localBondsStore.addTransaction({ date: '2023-01', amount: 1000, type: 'deposit' });
      const { id } = localBondsStore.addTransaction({
        date: '2023-06',
        amount: 200,
        type: 'withdrawal',
      });

      expect(() => localBondsStore.deleteTransaction(id)).not.toThrow();
      expect(localBondsStore.getTransactions()).toHaveLength(1);
    });
  });

  describe('getPrizes', () => {
    it('returns an empty array when storage is empty', () => {
      expect(localBondsStore.getPrizes()).toEqual([]);
    });
  });

  describe('addPrize', () => {
    it('persists and returns the new prize with an id', () => {
      const result = localBondsStore.addPrize({ date: '2023-06', amount: 25 });

      expect(result).toMatchObject({ date: '2023-06', amount: 25 });
      expect(result.id).toBeDefined();
    });
  });

  describe('updatePrize', () => {
    it('updates and returns the modified prize', () => {
      const { id } = localBondsStore.addPrize({ date: '2023-06', amount: 25 });
      const result = localBondsStore.updatePrize(id, { date: '2023-09', amount: 50 });

      expect(result).toMatchObject({ id, date: '2023-09', amount: 50 });
    });

    it('returns null when the id does not exist', () => {
      expect(localBondsStore.updatePrize('bad-id', { date: '2023-06', amount: 25 })).toBeNull();
    });
  });

  describe('deletePrize', () => {
    it('removes the prize and returns true', () => {
      const { id } = localBondsStore.addPrize({ date: '2023-06', amount: 25 });

      expect(localBondsStore.deletePrize(id)).toBe(true);
      expect(localBondsStore.getPrizes()).toHaveLength(0);
    });

    it('returns false when the id does not exist', () => {
      expect(localBondsStore.deletePrize('bad-id')).toBe(false);
    });
  });

  describe('calculate', () => {
    it('returns zero overall stats when storage is empty', () => {
      const result = localBondsStore.calculate();

      expect(result.byYear).toEqual([]);
      expect(result.overall.totalPrizesWon).toBe(0);
    });

    it('delegates to calculateLocal and returns results', () => {
      localBondsStore.addTransaction({ date: '2023-01', amount: 1000, type: 'deposit' });
      localBondsStore.addPrize({ date: '2023-06', amount: 25 });

      const result = localBondsStore.calculate();

      expect(result.byYear).toHaveLength(1);
      expect(result.overall.totalPrizesWon).toBe(25);
    });
  });

  describe('clear', () => {
    it('removes all transactions and prizes from storage', () => {
      localBondsStore.addTransaction({ date: '2023-01', amount: 1000, type: 'deposit' });
      localBondsStore.addPrize({ date: '2023-06', amount: 25 });
      localBondsStore.clear();

      expect(localBondsStore.getTransactions()).toEqual([]);
      expect(localBondsStore.getPrizes()).toEqual([]);
    });
  });
});
