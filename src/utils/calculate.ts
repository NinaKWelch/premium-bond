import type { TTransaction, TPrize, TResults } from '#types/bonds';

/** Parses a "YYYY-MM" string into a Date set to the 1st of that month. */
export const parseYM = (ym: string): Date => {
  const [y, m] = ym.split('-').map(Number);

  return new Date(y, m - 1, 1);
};

/** Returns true for transaction types that increase the bond balance. */
export const isDeposit = (type: string) => type === 'deposit' || type === 'reinvestment';

/** Returns 366 for leap years, 365 otherwise. */
export const daysInYear = (year: number): number => {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 366 : 365;
};

/**
 * Calculates the time-weighted average balance for a single calendar year.
 *
 * For each period between consecutive transaction dates (or between year
 * boundaries and the first/last transaction), the running balance is multiplied
 * by the number of days it was held. The sum is divided by the total days in
 * the year to produce the average.
 *
 * Transactions from prior years contribute to the opening balance; transactions
 * from future years are ignored.
 */
export const averageBalanceForYear = (
  year: number,
  transactions: { date: Date; amount: number; type: string }[],
): number => {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year + 1, 0, 1);
  const totalDays = daysInYear(year);

  const openingBalance = transactions
    .filter((t) => t.date < yearStart)
    .reduce((sum, t) => sum + (isDeposit(t.type) ? t.amount : -t.amount), 0);

  const eventsThisYear = transactions
    .filter((t) => t.date >= yearStart && t.date < yearEnd)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  let weightedSum = 0;
  let balance = openingBalance;
  let periodStart = yearStart;

  for (const event of eventsThisYear) {
    const days = (event.date.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24);

    weightedSum += balance * days;
    balance += isDeposit(event.type) ? event.amount : -event.amount;
    periodStart = event.date;
  }

  const remainingDays = (yearEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24);
  weightedSum += balance * remainingDays;

  return Number((weightedSum / totalDays).toFixed(2));
};

/**
 * Calculates the effective annual return for a set of Premium Bond transactions
 * and prizes.
 *
 * Returns per-year breakdowns (average balance, prizes won, effective rate) and
 * overall totals. The overall `averageAnnualRatePct` is derived from total
 * prizes divided by the mean annual balance — not an average of yearly
 * percentages — to avoid skew from low-balance years.
 *
 * `cashDeposited` reflects only real cash in/out (deposits and withdrawals),
 * excluding reinvested prizes. `totalInvested` includes reinvested amounts.
 */
export const calculateLocal = (transactions: TTransaction[], prizes: TPrize[]): TResults => {
  const txns = transactions.map((t) => ({ ...t, date: parseYM(t.date) }));
  const prz = prizes.map((p) => ({ ...p, date: parseYM(p.date) }));

  const allDates = [...txns.map((t) => t.date), ...prz.map((p) => p.date)];

  if (allDates.length === 0) {
    return {
      byYear: [],
      overall: { totalInvested: 0, cashDeposited: 0, totalPrizesWon: 0, averageAnnualRatePct: 0 },
    };
  }

  const minYear = Math.min(...allDates.map((d) => d.getFullYear()));
  const maxYear = Math.max(...allDates.map((d) => d.getFullYear()));

  const byYear = [];

  for (let year = minYear; year <= maxYear; year++) {
    const avgBalance = averageBalanceForYear(year, txns);
    const prizesWon = prz
      .filter((p) => p.date.getFullYear() === year)
      .reduce((sum, p) => sum + p.amount, 0);
    const amountInvested = txns
      .filter((t) => t.date.getFullYear() === year)
      .reduce((sum, t) => sum + (isDeposit(t.type) ? t.amount : -t.amount), 0);
    const effectiveRatePct =
      avgBalance > 0 ? Number(((prizesWon / avgBalance) * 100).toFixed(2)) : 0;

    byYear.push({ year, amountInvested, averageBalance: avgBalance, prizesWon, effectiveRatePct });
  }

  const totalInvested = txns.reduce(
    (sum, t) => sum + (isDeposit(t.type) ? t.amount : -t.amount),
    0,
  );
  const cashDeposited = txns
    .filter((t) => t.type === 'deposit' || t.type === 'withdrawal')
    .reduce((sum, t) => sum + (t.type === 'deposit' ? t.amount : -t.amount), 0);
  const totalPrizesWon = prz.reduce((sum, p) => sum + p.amount, 0);

  const meanAnnualBalance = byYear.reduce((sum, y) => sum + y.averageBalance, 0) / byYear.length;
  const averageAnnualRatePct =
    meanAnnualBalance > 0
      ? Number(((totalPrizesWon / byYear.length / meanAnnualBalance) * 100).toFixed(2))
      : 0;

  return {
    byYear,
    overall: { totalInvested, cashDeposited, totalPrizesWon, averageAnnualRatePct },
  };
};
