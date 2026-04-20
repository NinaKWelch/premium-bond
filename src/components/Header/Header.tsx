'use client';

import { useSession } from 'next-auth/react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { AccountCircleOutlined as AccountCircleIcon } from '@mui/icons-material';
import NavMenu from './NavMenu';

const Header = () => {
  const { data: session } = useSession();

  return (
    <AppBar position="static" className="print-hide">
      <Toolbar sx={{ py: { xs: 1.5, md: 2 } }}>
        <Container
          maxWidth="md"
          disableGutters
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 0.5,
          }}
        >
          {/* Title row */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontSize: { xs: '1.25rem', md: '2.125rem' } }}
              >
                Premium Bonds Interest Tracker
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, display: { xs: 'none', md: 'block' } }}>
                Track your NS&amp;I Premium Bond investments and prizes to see the effective annual
                return you are actually earning.
              </Typography>
            </Box>

            {/* Profile icon or sign-in */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexShrink: 0,
              }}
            >
              {session ? (
                <>
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.85, display: { xs: 'none', md: 'block' } }}
                  >
                    {session.user?.email}
                  </Typography>
                  <Tooltip title="Profile">
                    <IconButton href="/profile" sx={{ color: 'inherit' }}>
                      <AccountCircleIcon />
                    </IconButton>
                  </Tooltip>
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
          </Box>

          {/* Nav tabs */}
          <NavMenu />
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
