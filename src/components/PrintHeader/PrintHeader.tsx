import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const PrintHeader = () => (
  <Box className="print-title" sx={{ display: 'none', mb: 3 }}>
    <Typography variant="h5" component="h1">
      Premium Bonds Interest Tracker
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Track your NS&amp;I Premium Bond investments and prizes to see the effective annual return you
      are actually earning.
    </Typography>
  </Box>
)

export default PrintHeader
