import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { BondsProvider } from './context/BondsContext';
import Activity from './components/Activity';
import Calculator from './components/Calculator';
import ErrorNotification from './components/ErrorNotification';
import Header from './components/Header';
import PrintHeader from './components/PrintHeader';
import Results from './components/Results';
import SimpleCalculator from './components/SimpleCalculator';

const App = () => (
  <BondsProvider>
    <Header />
    <Container maxWidth="md" sx={{ py: 4 }}>
      <PrintHeader />
      <Stack spacing={4}>
        <SimpleCalculator />
        <Divider className="print-hide" />
        <Calculator />
        <Results />
        <Divider className="print-hide" />
        <Activity />
      </Stack>
    </Container>
    <ErrorNotification />
  </BondsProvider>
);

export default App;
