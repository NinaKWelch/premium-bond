import { describe, it, expect } from 'vitest';
import {
  calculateLocal,
  averageBalanceForYear,
  parseYM,
  isDeposit,
  daysInYear,
} from '../calculate';

describe('parseYM()', () => {
  it('returns the 1st of the given month', () => {
    const d = parseYM('2023-06');

    expect(d.getFullYear()).toBe(2023);
    expect(d.getMonth()).toBe(5); // 0-indexed
    expect(d.getDate()).toBe(1);
  });

  it('handles January (month 01)', () => {
    const d = parseYM('2024-01');

    expect(d.getFullYear()).toBe(2024);
    expect(d.getMonth()).toBe(0);
  });

  it('handles December (month 12)', () => {
    const d = parseYM('2024-12');

    expect(d.getFullYear()).toBe(2024);
    expect(d.getMonth()).toBe(11);
  });
});

describe('isDeposit()', () => {
  it('returns true for "deposit"', () => expect(isDeposit('deposit')).toBe(true));
  it('returns true for "reinvestment"', () => expect(isDeposit('reinvestment')).toBe(true));
  it('returns false for "withdrawal"', () => expect(isDeposit('withdrawal')).toBe(false));
  it('returns false for an unknown type', () => expect(isDeposit('other')).toBe(false));
});

describe('daysInYear()', () => {
  it('returns 365 for a common year', () => expect(daysInYear(2023)).toBe(365));
  it('returns 366 for a year divisible by 4', () => expect(daysInYear(2024)).toBe(366));
  it('returns 365 for a century year (divisible by 100 but not 400)', () =>
    expect(daysInYear(1900)).toBe(365));
  it('returns 366 for a 400-year cycle year', () => expect(daysInYear(2000)).toBe(366));
});

// Helper: build a transaction in the shape averageBalanceForYear expects
const txn = (date: Date, amount: number, type = 'deposit') => ({ date, amount, type });

describe('averageBalanceForYear()', () => {
  it('returns 0 when there are no transactions', () => {
    expect(averageBalanceForYear(2023, [])).toBe(0);
  });

  it('returns the full deposit amount for a Jan 1 deposit held all year', () => {
    // Deposit on Jan 1 → balance for all 365 days → average = 1000
    const result = averageBalanceForYear(2023, [txn(new Date(2023, 0, 1), 1000)]);

    expect(result).toBe(1000);
  });

  it('weights a mid-year deposit by the fraction of the year it was held', () => {
    // Deposit on Jul 1 (day 182 of 365).
    // Jan 1→Jul 1 = 181 days at £0, Jul 1→Jan 1 = 184 days at £1000
    // average = (0 * 181 + 1000 * 184) / 365 = 504.11
    const result = averageBalanceForYear(2023, [txn(new Date(2023, 6, 1), 1000)]);

    expect(result).toBeCloseTo(504.11, 1);
  });

  it('accumulates multiple deposits correctly', () => {
    // £1000 from Jan 1, £500 more from Jul 1
    // Jan 1→Jul 1: 181 days at £1000; Jul 1→Jan 1: 184 days at £1500
    // average = (1000 * 181 + 1500 * 184) / 365 ≈ 1252.05
    const result = averageBalanceForYear(2023, [
      txn(new Date(2023, 0, 1), 1000),
      txn(new Date(2023, 6, 1), 500),
    ]);

    expect(result).toBeCloseTo(1252.05, 1);
  });

  it('reduces balance on withdrawal', () => {
    // £1000 from Jan 1, £200 withdrawn Jul 1
    // Jan 1→Jul 1: 181 days at £1000; Jul 1→Jan 1: 184 days at £800
    // average = (1000 * 181 + 800 * 184) / 365 = 899.18
    const result = averageBalanceForYear(2023, [
      txn(new Date(2023, 0, 1), 1000),
      txn(new Date(2023, 6, 1), 200, 'withdrawal'),
    ]);

    expect(result).toBeCloseTo(899.18, 1);
  });

  it('uses the opening balance carried in from prior-year transactions', () => {
    // £1000 deposited in 2022 should count as opening balance for 2023
    const result = averageBalanceForYear(2023, [txn(new Date(2022, 0, 1), 1000)]);

    expect(result).toBe(1000);
  });

  it('uses 366 days for a leap year', () => {
    // £1000 on Jan 1 2024 (leap year) — average should still be 1000 (full year held)
    const result = averageBalanceForYear(2024, [txn(new Date(2024, 0, 1), 1000)]);

    expect(result).toBe(1000);
  });

  it('ignores transactions from future years', () => {
    // A deposit in 2024 should not affect the 2023 average
    const result = averageBalanceForYear(2023, [txn(new Date(2024, 0, 1), 1000)]);

    expect(result).toBe(0);
  });
});

const deposit = (date: string, amount: number) => ({
  id: '1',
  date,
  amount,
  type: 'deposit' as const,
});
const withdrawal = (date: string, amount: number) => ({
  id: '2',
  date,
  amount,
  type: 'withdrawal' as const,
});
const reinvestment = (date: string, amount: number) => ({
  id: '3',
  date,
  amount,
  type: 'reinvestment' as const,
});
const prize = (date: string, amount: number) => ({ id: 'p1', date, amount });

describe('calculateLocal()', () => {
  it('returns zero overall stats with no transactions or prizes', () => {
    const result = calculateLocal([], []);

    expect(result.byYear).toEqual([]);
    expect(result.overall).toEqual({
      totalInvested: 0,
      cashDeposited: 0,
      totalPrizesWon: 0,
      averageAnnualRatePct: 0,
    });
  });

  it('calculates effectiveRatePct for a full-year deposit', () => {
    // £1000 deposited on 1 Jan 2023 → average balance ≈ 1000, prize £25 → 2.5%
    const result = calculateLocal([deposit('2023-01', 1000)], [prize('2023-06', 25)]);

    expect(result.byYear).toHaveLength(1);
    expect(result.byYear[0].year).toBe(2023);
    expect(result.byYear[0].prizesWon).toBe(25);
    expect(result.byYear[0].effectiveRatePct).toBeCloseTo(2.5, 0);
  });

  it('sets effectiveRatePct to 0 when there are no prizes', () => {
    const result = calculateLocal([deposit('2023-01', 1000)], []);

    expect(result.byYear[0].effectiveRatePct).toBe(0);
  });

  it('sets effectiveRatePct to 0 when average balance is 0', () => {
    // Deposit and same-month withdrawal cancel out; average balance = 0 for the rest of the year
    const result = calculateLocal(
      [deposit('2023-01', 1000), withdrawal('2023-01', 1000)],
      [prize('2023-06', 25)],
    );

    expect(result.byYear[0].effectiveRatePct).toBe(0);
  });

  it('counts amountInvested as net deposits minus withdrawals for the year', () => {
    const result = calculateLocal([deposit('2023-03', 1000), withdrawal('2023-09', 200)], []);

    expect(result.byYear[0].amountInvested).toBe(800);
  });

  it('produces a row for each year spanned by transactions and prizes', () => {
    const result = calculateLocal(
      [deposit('2022-01', 1000)],
      [prize('2022-06', 25), prize('2023-06', 30)],
    );

    expect(result.byYear).toHaveLength(2);
    expect(result.byYear[0].year).toBe(2022);
    expect(result.byYear[1].year).toBe(2023);
  });

  it('carries the opening balance forward into subsequent years', () => {
    const result = calculateLocal([deposit('2022-01', 1000)], [prize('2023-06', 30)]);

    // In 2023 there are no new transactions, so average balance should be ~1000
    expect(result.byYear[1].averageBalance).toBeCloseTo(1000, 0);
  });

  it('treats reinvestment as a deposit for balance purposes', () => {
    const result = calculateLocal(
      [deposit('2023-01', 1000), reinvestment('2023-07', 25)],
      [prize('2023-07', 25)],
    );

    // Balance increases mid-year, so average balance > 1000
    expect(result.byYear[0].averageBalance).toBeGreaterThan(1000);
  });

  it('does not count reinvestment in cashDeposited', () => {
    const result = calculateLocal([deposit('2023-01', 1000), reinvestment('2023-07', 25)], []);

    expect(result.overall.cashDeposited).toBe(1000);
  });

  it('sums all prizes for totalPrizesWon', () => {
    const result = calculateLocal(
      [deposit('2022-01', 1000)],
      [prize('2022-06', 25), prize('2023-03', 50)],
    );

    expect(result.overall.totalPrizesWon).toBe(75);
  });

  it('reflects net cash movements in totalInvested', () => {
    const result = calculateLocal([deposit('2022-01', 1000), withdrawal('2022-06', 200)], []);

    expect(result.overall.totalInvested).toBe(800);
  });

  it('excludes reinvestments from cashDeposited but includes them in totalInvested', () => {
    const result = calculateLocal([deposit('2023-01', 1000), reinvestment('2023-07', 25)], []);

    expect(result.overall.cashDeposited).toBe(1000);
    expect(result.overall.totalInvested).toBe(1025);
  });

  it('returns 0 averageAnnualRatePct when there are no prizes', () => {
    const result = calculateLocal([deposit('2023-01', 1000)], []);

    expect(result.overall.averageAnnualRatePct).toBe(0);
  });

  it('uses 366 days for a leap year', () => {
    // 2024 is a leap year; £1000 for the full year, £25 prize → 25/1000 * 100 = 2.5%
    const result = calculateLocal([deposit('2024-01', 1000)], [prize('2024-06', 25)]);

    expect(result.byYear[0].effectiveRatePct).toBeCloseTo(2.5, 0);
  });
});
