import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Header from '#components/Header';

const NotFound = () => (
  <>
    <Header />
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        gap: 2,
        px: 2,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 700, lineHeight: 1 }}>
        404
      </Typography>
      <Typography variant="h5" color="text.secondary">
        Page not found
      </Typography>
      <Button component={NextLink} href="/" variant="contained" sx={{ mt: 1 }}>
        Go home
      </Button>
    </Box>
  </>
);

export default NotFound;
