import type { TSimpleResult } from '#types/bonds';

/**
 * Estimates the effective annual rate of return from Premium Bond prizes.
 *
 * Calculates elapsed time in fractional years from the first investment month
 * to today (using 365.25 days/year to account for leap years), then divides
 * total prizes by total invested and time held to produce an annualised rate.
 *
 * Returns the elapsed years alongside the rate so callers can display both.
 */
export const estimateEffectiveRate = (
  firstInvestmentMonth: string,
  totalInvested: number,
  totalPrizes: number,
): TSimpleResult => {
  const [year, month] = firstInvestmentMonth.split('-').map(Number);
  const start = new Date(year, month - 1, 1);
  const now = new Date();
  const years = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const effectiveRatePct = (totalPrizes / totalInvested / years) * 100;

  return { years, effectiveRatePct };
};
