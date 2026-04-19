'use client';

import { useSession, signOut } from 'next-auth/react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Header = () => {
  const { data: session } = useSession();

  return (
    <AppBar position="static" className="print-hide">
      <Toolbar sx={{ py: 2 }}>
        <Container
          maxWidth="md"
          disableGutters
          sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}
        >
          <Box>
            <Typography variant="h4" component="h1">
              Premium Bonds Interest Tracker
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              Track your NS&amp;I Premium Bond investments and prizes to see the effective annual
              return you are actually earning.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, flexShrink: 0 }}>
            {session ? (
              <>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {session.user?.email}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => void signOut({ callbackUrl: '/login' })}
                  sx={{
                    color: 'inherit',
                    borderColor: 'rgba(255,255,255,0.5)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                size="small"
                href="/login"
                sx={{
                  color: 'inherit',
                  borderColor: 'rgba(255,255,255,0.5)',
                  whiteSpace: 'nowrap',
                }}
              >
                Sign in
              </Button>
            )}
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
