import NextLink from 'next/link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

const GuestSaveBanner = () => (
  <Alert
    severity="info"
    action={
      <Button component={NextLink} href="/register" color="inherit" size="small" variant="outlined">
        Create account
      </Button>
    }
    sx={{ mt: 3 }}
  >
    Create a free account to save your transactions and results permanently.
  </Alert>
);

export default GuestSaveBanner;
