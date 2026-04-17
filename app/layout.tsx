import type { Metadata } from 'next';
import ThemeRegistry from '#components/ThemeRegistry';

export const metadata: Metadata = {
  title: 'Premium Bond Tracker',
  description:
    'Calculate the actual interest rate you earned from UK NS&I Premium Bonds based on your real deposits, withdrawals, and prizes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
