import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { estimateEffectiveRate } from '../rateEstimator'

describe('estimateEffectiveRate', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calculates years elapsed from first investment month to now', () => {
    const now = new Date(2025, 0, 1) // 1 Jan 2025
    vi.setSystemTime(now)
    const { years } = estimateEffectiveRate('2023-01', 1000, 0)
    // 2024 is a leap year, so Jan 1 2023 → Jan 1 2025 = 731 days
    const expected =
      (now.getTime() - new Date(2023, 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    expect(years).toBeCloseTo(expected, 5)
  })

  it('calculates effective rate from prizes and invested amount', () => {
    vi.setSystemTime(new Date(2025, 0, 1)) // 1 Jan 2025
    const totalInvested = 1000
    const totalPrizes = 40
    const { years, effectiveRatePct } = estimateEffectiveRate('2023-01', totalInvested, totalPrizes)
    expect(effectiveRatePct).toBeCloseTo((totalPrizes / totalInvested / years) * 100, 5)
  })

  it('returns 0% effective rate when no prizes won', () => {
    vi.setSystemTime(new Date(2025, 0, 1))
    const { effectiveRatePct } = estimateEffectiveRate('2023-01', 1000, 0)
    expect(effectiveRatePct).toBe(0)
  })

  it('returns a higher rate for more prizes on the same investment', () => {
    vi.setSystemTime(new Date(2025, 0, 1))
    const low = estimateEffectiveRate('2023-01', 1000, 25)
    const high = estimateEffectiveRate('2023-01', 1000, 100)
    expect(high.effectiveRatePct).toBeGreaterThan(low.effectiveRatePct)
  })

  it('returns a lower rate for more invested with the same prizes', () => {
    vi.setSystemTime(new Date(2025, 0, 1))
    const small = estimateEffectiveRate('2023-01', 1000, 50)
    const large = estimateEffectiveRate('2023-01', 50000, 50)
    expect(large.effectiveRatePct).toBeLessThan(small.effectiveRatePct)
  })

  it('handles a start month in the same year as now', () => {
    const now = new Date(2025, 5, 1) // 1 Jun 2025
    vi.setSystemTime(now)
    const { years } = estimateEffectiveRate('2025-01', 1000, 25)
    const expected =
      (now.getTime() - new Date(2025, 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    expect(years).toBeCloseTo(expected, 5)
  })
})
