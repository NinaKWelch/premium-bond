import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { auth } from '../auth';
import ThemeRegistry from '#components/ThemeRegistry';

export const metadata: Metadata = {
  title: 'Premium Bond Tracker',
  description:
    'Calculate the actual interest rate you earned from UK NS&I Premium Bonds based on your real deposits, withdrawals, and prizes.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <SessionProvider session={session}>
          <ThemeRegistry>{children}</ThemeRegistry>
        </SessionProvider>
      </body>
    </html>
  );
}
