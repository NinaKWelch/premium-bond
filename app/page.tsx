import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Header from '#components/Header';
import SimpleCalculator from '#components/SimpleCalculator';

export default function HomePage() {
  return (
    <>
      <Header />
      <Container component="main" maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={4}>
          <Stack spacing={2}>
            <Typography variant="body1">
              NS&I Premium Bonds don't pay interest — instead, each £1 bond is entered into a
              monthly prize draw. The headline rate HMRC publishes is just an average across all
              holders. Your actual return depends on how long your money was invested and which
              prizes you personally won.
            </Typography>
            <Typography variant="body1">
              Use the quick estimator below for a rough figure, or{' '}
              <Typography
                component="a"
                href="/dashboard"
                variant="body1"
                color="primary"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                open the full tracker
              </Typography>{' '}
              to log every deposit, withdrawal, and prize and get an exact year-by-year breakdown.
            </Typography>
          </Stack>
          <Divider />
          <SimpleCalculator />
        </Stack>
      </Container>
    </>
  );
}
