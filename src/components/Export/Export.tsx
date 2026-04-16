import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { TTransaction, TPrize } from '#types/bonds';
import downloadFile from '#utils/downloadFile';

interface IExportProps {
  transactions: TTransaction[]
  prizes: TPrize[]
  onPrint: () => void
}

const Export = ({ transactions, prizes, onPrint }: IExportProps) => {
  const handleCsv = () => {
    const rows = [
      ['Date', 'Type', 'Amount'],
      ...transactions.map((t) => [t.date, t.type, t.amount.toString()]),
      ...prizes.map((p) => [p.date, 'prize', p.amount.toString()]),
    ]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map((row) => row.join(','))
      .join('\n');

    downloadFile(rows, 'premium-bonds.csv', 'text/csv');
  };

  return (
    <Stack
      direction="row"
      className="print-hide"
      sx={{
        display: { xs: 'none', sm: 'flex' },
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Export your data for use in a spreadsheet or save your results as a PDF.
      </Typography>
      <Stack direction="row" spacing={2} sx={{ flexShrink: 0, ml: 3 }}>
        <Button variant="outlined" size="small" onClick={handleCsv}>
          Download CSV
        </Button>
        <Button variant="outlined" size="small" onClick={onPrint}>
          Save as PDF
        </Button>
      </Stack>
    </Stack>
  );
};

export default Export;
