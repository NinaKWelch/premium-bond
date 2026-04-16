import type { TSimpleResult } from '#types/bonds';

/**
 * Estimates the effective annual rate of return from Premium Bond prizes.
 * Uses elapsed time from the first investment month to today.
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
