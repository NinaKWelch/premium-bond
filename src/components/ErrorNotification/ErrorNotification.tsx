import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import useBonds from '../../context/useBonds';

const ErrorNotification = () => {
  const { errorMessage, clearError } = useBonds();

  return (
    <>
      {/* Mobile: bottom center */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ display: { xs: 'flex', sm: 'none' } }}
      >
        <Alert severity="error" onClose={clearError} sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Tablet/desktop: top right */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ display: { xs: 'none', sm: 'flex' } }}
      >
        <Alert severity="error" onClose={clearError} sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ErrorNotification;
