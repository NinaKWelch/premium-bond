import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import BondResults from './BondResults'
import useBonds from '../../context/useBonds'

const Results = () => {
  const { results, calculating, transactions, prizes, handleCalculate } = useBonds()
  const hasActivity = transactions.length > 0 || prizes.length > 0

  return (
    <Box>
      <Box className="print-hide">
        {hasActivity ? (
          <Button
            variant="contained"
            fullWidth
            onClick={handleCalculate}
            loading={calculating}
            sx={{ height: 56, fontSize: '1rem' }}
          >
            Calculate detailed rate
          </Button>
        ) : (
          <Typography color="text.secondary">
            Add at least one transaction and prizes won above to calculate your detailed rate.
          </Typography>
        )}
      </Box>
      {results && (
        <Box sx={{ mt: 3 }}>
          <BondResults results={results} />
        </Box>
      )}
    </Box>
  )
}

export default Results
