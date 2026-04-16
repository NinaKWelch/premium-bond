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

export const currentYear = (): number => new Date().getFullYear();

export const lastMonth = (): string => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const toYearMonth = (year: string | number, month: string) => `${String(year)}-${month}`;

export const fromYearMonth = (date: string): { year: string; month: string } => {
  const [year, month] = date.split('-');
  return { year, month };
};

export const formatYearMonth = (date: string): string => date.replace('-', '/');
