import { PREMIUM_BONDS_LAUNCH_YEAR } from '#constants';

/** Returns the current calendar year as a number. */
export const currentYear = (): number => new Date().getFullYear();

/** Returns an array of year strings descending from the current year to `startYear`. */
export const yearOptions = (startYear: number): string[] => {
  const years: string[] = [];
  for (let y = currentYear(); y >= startYear; y--) {
    years.push(String(y));
  }

  return years;
};

/** Returns the current month as a "YYYY-MM" string. */
export const currentMonth = (): string => {
  const d = new Date();

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

/** Returns the previous month as a "YYYY-MM" string. */
export const lastMonth = (): string => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

/** Combines a year and a zero-padded month string into a "YYYY-MM" string. */
export const toYearMonth = (year: string | number, month: string) => `${String(year)}-${month}`;

/** Splits a "YYYY-MM" string into its year and month parts. */
export const fromYearMonth = (date: string): { year: string; month: string } => {
  const [year, month] = date.split('-');

  return { year, month };
};

/** Formats a "YYYY-MM" string for display as "YYYY/MM". */
export const formatYearMonth = (date: string): string => date.replace('-', '/');

/** All valid years for the date pickers, from the current year back to the Premium Bonds launch year. */
export const YEARS = yearOptions(PREMIUM_BONDS_LAUNCH_YEAR);

export const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];
