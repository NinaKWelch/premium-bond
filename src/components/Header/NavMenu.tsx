'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

type TNavItem = { label: string; href: string };

const useNavItems = (): TNavItem[] => {
  const { data: session, status } = useSession();
  const isGuest = status === 'unauthenticated';
  const hasTracker = !!session || isGuest;

  return [
    { label: 'Home', href: '/' },
    ...(hasTracker ? [{ label: 'Interest tracker', href: '/premium-bonds/interest-tracker' }] : []),
  ];
};

const NavMenu = () => {
  const items = useNavItems();
  const pathname = usePathname();

  const activeTab = items.findIndex((item) => item.href === pathname);

  return (
    <nav>
      <Tabs
        value={activeTab === -1 ? false : activeTab}
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        slotProps={{ indicator: { style: { backgroundColor: 'white' } } }}
        sx={{ minHeight: 0 }}
      >
        {items.map((item) => (
          <Tab
            key={item.href}
            label={item.label}
            href={item.href}
            component="a"
            sx={{
              color: 'inherit',
              opacity: 0.85,
              textTransform: 'none',
              fontSize: '0.95rem',
              minHeight: 40,
              py: 0.5,
              '&.Mui-selected': { opacity: 1 },
            }}
          />
        ))}
      </Tabs>
    </nav>
  );
};

export default NavMenu;
