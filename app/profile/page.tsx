'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Header from '#components/Header';
import { deleteAccount } from '#api/users';
import { clearGuestCookie } from '../actions';

const ProfilePage = () => {
  const { data: session } = useSession();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!session?.backendToken) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await deleteAccount(session.backendToken);
      await clearGuestCookie();
      await signOut({ callbackUrl: '/' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Profile
            </Typography>
            <Typography color="text.secondary">{session?.user?.email}</Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Account
            </Typography>
            <Button
              variant="outlined"
              onClick={() => void clearGuestCookie().then(() => signOut({ callbackUrl: '/login' }))}
            >
              Sign out
            </Button>
          </Box>

          <Divider />

          <Card variant="outlined" sx={{ borderColor: 'error.main' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main', mb: 1 }}>
                Danger zone
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Permanently delete your account and all associated data. This cannot be undone.
              </Typography>
              {error && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <Button variant="outlined" color="error" onClick={() => setConfirmOpen(true)}>
                Delete account
              </Button>
            </CardContent>
          </Card>
        </Stack>
      </Container>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete your account and all your transactions and prizes. This
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" loading={deleting} onClick={handleDelete}>
            Delete account
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfilePage;
