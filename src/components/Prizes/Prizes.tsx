import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PrizeForm from './PrizeForm';

import type { TPrizeFormValues } from '../../types/bonds';

interface IPrizesProps {
  onSubmit: (data: TPrizeFormValues) => Promise<void>
}

const Prizes = ({ onSubmit }: IPrizesProps) => (
  <Box>
    <Typography variant="h5" component="h2" gutterBottom>
      Prizes
    </Typography>
    <PrizeForm onSubmit={onSubmit} />
  </Box>
);

export default Prizes;
