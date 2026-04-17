import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  MONTHS,
  currentYear,
  currentMonth,
  yearOptions,
  toYearMonth,
  fromYearMonth,
  formatYearMonth,
  lastMonth,
} from '../date';

describe('toYearMonth', () => {
  it('combines a string year and month', () => {
    expect(toYearMonth('2024', '03')).toBe('2024-03');
  });

  it('combines a numeric year and month', () => {
    expect(toYearMonth(2024, '03')).toBe('2024-03');
  });

  it('preserves leading zeros on the month', () => {
    expect(toYearMonth('2024', '01')).toBe('2024-01');
  });
});

describe('fromYearMonth', () => {
  it('splits a YYYY-MM string into year and month', () => {
    expect(fromYearMonth('2024-03')).toEqual({ year: '2024', month: '03' });
  });

  it('preserves leading zeros on the month', () => {
    expect(fromYearMonth('2024-01')).toEqual({ year: '2024', month: '01' });
  });

  it('is the inverse of toYearMonth', () => {
    const original = '2026-11';
    const { year, month } = fromYearMonth(original);
    expect(toYearMonth(year, month)).toBe(original);
  });
});

describe('formatYearMonth', () => {
  it('replaces the hyphen with a slash', () => {
    expect(formatYearMonth('2024-03')).toBe('2024/03');
  });

  it('preserves leading zeros on the month', () => {
    expect(formatYearMonth('2024-01')).toBe('2024/01');
  });
});

describe('currentYear', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the current full year', () => {
    vi.setSystemTime(new Date(2025, 3, 16));
    expect(currentYear()).toBe(2025);
  });

  it('reflects a different year when the clock changes', () => {
    vi.setSystemTime(new Date(2030, 0, 1));
    expect(currentYear()).toBe(2030);
  });
});

describe('currentMonth', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the current month in YYYY-MM format', () => {
    vi.setSystemTime(new Date(2025, 3, 16)); // April 2025
    expect(currentMonth()).toBe('2025-04');
  });

  it('pads single-digit months with a leading zero', () => {
    vi.setSystemTime(new Date(2025, 0, 1)); // January 2025
    expect(currentMonth()).toBe('2025-01');
  });

  it('reflects a different month when the clock changes', () => {
    vi.setSystemTime(new Date(2030, 11, 1)); // December 2030
    expect(currentMonth()).toBe('2030-12');
  });
});

describe('yearOptions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns strings in descending order', () => {
    vi.setSystemTime(new Date(2025, 0, 1));
    const years = yearOptions(2023);
    expect(years).toEqual(['2025', '2024', '2023']);
  });

  it('starts with the current year', () => {
    vi.setSystemTime(new Date(2025, 0, 1));
    expect(yearOptions(2020)[0]).toBe('2025');
  });

  it('ends with the given start year', () => {
    vi.setSystemTime(new Date(2025, 0, 1));
    const years = yearOptions(2020);
    expect(years[years.length - 1]).toBe('2020');
  });

  it('returns a single entry when start year equals current year', () => {
    vi.setSystemTime(new Date(2025, 0, 1));
    expect(yearOptions(2025)).toEqual(['2025']);
  });
});

describe('lastMonth', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the previous month in YYYY-MM format', () => {
    vi.setSystemTime(new Date(2025, 3, 16)); // April 2025
    expect(lastMonth()).toBe('2025-03');
  });

  it('wraps back to December of the previous year in January', () => {
    vi.setSystemTime(new Date(2025, 0, 1)); // January 2025
    expect(lastMonth()).toBe('2024-12');
  });

  it('pads single-digit months with a leading zero', () => {
    vi.setSystemTime(new Date(2025, 1, 1)); // February 2025
    expect(lastMonth()).toBe('2025-01');
  });
});

describe('MONTHS', () => {
  it('has 12 entries', () => {
    expect(MONTHS).toHaveLength(12);
  });

  it('values run from 01 to 12', () => {
    const values = MONTHS.map((m) => m.value);
    expect(values).toEqual(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']);
  });

  it('starts with January and ends with December', () => {
    expect(MONTHS[0].label).toBe('January');
    expect(MONTHS[11].label).toBe('December');
  });
});
