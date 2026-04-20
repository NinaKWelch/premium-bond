import NextLink from 'next/link';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const GuestSaveBanner = () => (
  <Alert
    severity="info"
    action={
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Button component={NextLink} href="/login" color="inherit" size="small">
          Sign in
        </Button>
        <Button
          component={NextLink}
          href="/register"
          color="inherit"
          size="small"
          variant="outlined"
        >
          Create account
        </Button>
      </Box>
    }
    sx={{ mt: 3 }}
  >
    Save your transactions and results permanently.
  </Alert>
);

export default GuestSaveBanner;
